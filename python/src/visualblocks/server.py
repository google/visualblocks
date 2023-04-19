from datetime import datetime
from flask import Flask
from flask import make_response
from flask import request
from flask import send_from_directory
from google.colab import _message
from google.colab import output
from google.colab.output import eval_js
from IPython import display
from IPython.utils import io
import json
import logging
import numpy as np
import os
import portpicker
import requests
import shutil
import sys
import threading
import traceback
import urllib.parse
import zipfile

_VISUAL_BLOCKS_BUNDLE_VERSION = '1681885544'

# Disable logging from werkzeug.
#
# Without this, flask will show a warning about using dev server (which is OK
# in our usecase).
logging.getLogger('werkzeug').disabled = True


def js(script):
  display.display(display.Javascript(script))


def html(script):
  display.display(display.HTML(script))


def _json_to_ndarray(json_tensor):
  """Convert a JSON dictionary from the web app to an np.ndarray."""
  array = np.array(json_tensor['tensorValues'])
  array.shape = json_tensor['tensorShape']
  return array


def _ndarray_to_json(array):
  """Convert a np.ndarray to the JSON dictionary for the web app."""
  values = array.ravel().tolist()
  shape = array.shape
  return {
    'tensorValues': values,
    'tensorShape': shape,
  }


def _make_json_response(obj):
  body = json.dumps(obj)
  resp = make_response(body)
  resp.headers['Content-Type'] = 'application/json'
  return resp


def _ensure_iterable(x):
  """Turn x into an iterable if not already iterable, unless it is None."""
  if x is None or hasattr(x, '__iter__'):
    return x
  else:
    return (x,)


def _find_fn(name:str, functions):
  """Find a function in a list of functions by its string name."""
  names = [fn.__name__ for fn in functions]
  i = names.index(name)
  return functions[i]


def Server(generic=None, text_to_text=None, text_to_tensors=None, height=900, tmp_dir='/tmp', read_saved_pipeline=True):
  """Creates a server that serves visual blocks web app in an iFrame.

  Other than serving the web app, it will also listen to requests sent from the
  web app at various API end points. Once a request is received, it will use the
  data in the request body to call the corresponding functions passed in.

  Args:
    generic:
      A function or iterable of functions, defined in the same Colab notebook,
      that Visual Blocks can call to implement a generic model runner block.

      A generic inference function must take a single argument, the input
      tensors as an iterable of numpy.ndarrays; run inference; and return the output
      tensors, also as an iterable of numpy.ndarrays.

    text_to_text:
      A function or iterable of functions, defined in the same Colab notebook,
      that Visual Blocks can call to implement a text-to-text model runner
      block.

      A text_to_text function must take a string and return a string.

    text_to_tensors:
      A function or iterable of functions, defined in the same Colab notebook,
      that Visual Blocks can call to implement a text-to-tensors model runner
      block.

      A text_to_tensors function must take a string and return the output
      tensors, as an iterable of numpy.ndarrays.

    height:
      The height of the embedded iFrame.

    tmp_dir:
      The tmp dir where the server stores the web app's static resources.

    read_saved_pipeline:
      Whether to read the saved pipeline in the notebook or not.
  """

  generic = _ensure_iterable(generic)
  text_to_text = _ensure_iterable(text_to_text)
  text_to_tensors = _ensure_iterable(text_to_tensors)

  app = Flask(__name__)

  # Disable startup messages.
  cli = sys.modules['flask.cli']
  cli.show_server_banner = lambda *x: None

  # Prepare tmp dir and log file.
  base_path = tmp_dir + '/visual-blocks-colab';
  if os.path.exists(base_path):
    shutil.rmtree(base_path)
  os.mkdir(base_path)
  log_file_path = base_path + '/log'
  open(log_file_path, 'w').close()

  # Download the zip file that bundles the visual blocks web app.
  bundle_target_path = os.path.join(base_path, 'visual_blocks.zip')
  url = 'https://storage.googleapis.com/tfweb/rapsai-colab-bundles/visual_blocks_%s.zip' % _VISUAL_BLOCKS_BUNDLE_VERSION
  r = requests.get(url)
  with open(bundle_target_path , 'wb') as zip_file:
    zip_file.write(r.content)

  # Unzip it.
  # This will unzip all files to {base_path}/build.
  with zipfile.ZipFile(bundle_target_path, 'r') as zip_ref:
    zip_ref.extractall(base_path)
  site_root_path = os.path.join(base_path, 'build')

  def log(msg):
    """Logs the given message to the log file."""
    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    with open(log_file_path, "a") as log_file:
      log_file.write("{}: {}\n".format(dt_string, msg))

  @app.route('/api/list_inference_functions')
  def list_inference_functions():
    result = {}
    if generic:
      result['generic'] = [fn.__name__ for fn in generic]
    if text_to_text:
      result['text_to_text'] = [fn.__name__ for fn in text_to_text]
    if text_to_tensors:
      result['text_to_tensors'] = [fn.__name__ for fn in text_to_tensors]
    return _make_json_response(result)

  # Note: using "/api/..." for POST requests is not allowed.
  @app.route('/apipost/inference', methods=['POST'])
  def inference_generic():
    """Handler for the generic api endpoint."""
    result = {}
    try:
      try:
        inference_fn = _find_fn(request.json['function'], generic)
      except KeyError:
        # TODO: remove this fallback try-block after .js implments function key
        inference_fn = generic[0]
      input_tensors = [_json_to_ndarray(x) for x in request.json['tensors']]
      output_tensors = inference_fn(input_tensors)
      result['tensors'] = [_ndarray_to_json(x) for x in output_tensors]
    except Exception as e:
      msg = ''.join(traceback.format_exception(type(e), e, e.__traceback__))
      result = {'error': msg}
    finally:
      return _make_json_response(result)

  # Note: using "/api/..." for POST requests is not allowed.
  @app.route('/apipost/inference_text_to_text', methods=['POST'])
  def inference_text_to_text():
    """Handler for the text_to_text api endpoint."""
    result = {}
    try:
      try:
        inference_fn = _find_fn(request.json['function'], text_to_text)
      except KeyError:
        # TODO: remove this fallback try-block after .js implments function key
        inference_fn = text_to_text[0]
      text = request.json['text']
      result['text'] = inference_fn(text)
    except Exception as e:
      msg = ''.join(traceback.format_exception(type(e), e, e.__traceback__))
      result = {'error': msg}
    finally:
      return _make_json_response(result)

  # Note: using "/api/..." for POST requests is not allowed.
  @app.route('/apipost/inference_text_to_tensors', methods=['POST'])
  def inference_text_to_tensors():
    """Handler for the text_to_tensors api endpoint."""
    result = {}
    try:
      try:
        inference_fn = _find_fn(request.json['function'], text_to_tensors)
      except KeyError:
        # TODO: remove this fallback try-block after .js implments function key
        inference_fn = text_to_tensors[0]
      text = request.json['text']
      output_tensors = inference_fn(text)
      result['tensors'] = [_ndarray_to_json(x) for x in output_tensors]
    except Exception as e:
      msg = ''.join(traceback.format_exception(type(e), e, e.__traceback__))
      result = {'error': msg}
    finally:
      return _make_json_response(result)

  @app.route('/<path:path>')
  def get_static(path):
    """Handler for serving static resources."""
    return send_from_directory(site_root_path, path)

  def embed(port, height):
    """Embeds iFrame."""
    shell = """
      (async () => {
            // Listen to event when user clicks the "Save to colab" button.
            window.addEventListener('message', (e) => {
              if (!e.data) {
                return;
              }
              const cmd = e.data.cmd;
              if (cmd === 'rapsai-save-to-colab') {
                const project = e.data.data;
                google.colab.kernel.invokeFunction('saveProject', [JSON.stringify(project)], {});
              }
            });

            const url = await google.colab.kernel.proxyPort(%PORT%, {"cache": true})
                + 'index.html#/edit/_%PIPELINE_JSON%';
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '%HEIGHT%');
            iframe.setAttribute('frameborder', 0);
            iframe.setAttribute('style', 'border: 1px solid #ccc; box-sizing: border-box;');
            iframe.setAttribute('allow', 'camera;microphone');

            const uiContainer = document.body.querySelector('#ui-container');
            uiContainer.innerHTML = '';
            if (google.colab.kernel.accessAllowed) {
              uiContainer.appendChild(iframe);
            }
        })();
    """
    replacements = [
        ("%PORT%", "%d" % port),
        ("%HEIGHT%", "%d" % height),
    ]
    # Append pipeline_json string to the url if it is saved in the notebook.
    if pipeline_json == '':
      replacements.append(('%PIPELINE_JSON%', ''))
    else:
      replacements.append(('%PIPELINE_JSON%', '?project=%s' % urllib.parse.quote(pipeline_json)))

    for (k, v) in replacements:
        shell = shell.replace(k, v)

    js(shell)

  def read_pipeline_json_from_notebook():
    # Read the current notebook and find the pipeline json.
    cur_pipeline_json = ''
    if read_saved_pipeline:
      notebook_json_string = _message.blocking_request('get_ipynb', request='', timeout_sec=300)
      for cell in notebook_json_string['ipynb']['cells']:
        if 'outputs' not in cell:
          continue
        for cur_output in cell['outputs']:
          if 'data' not in cur_output:
            continue
          if 'text/html' not in cur_output['data']:
            continue
          if cur_output['data']['text/html'] is not None:
            cur_text = cur_output['data']['text/html']
            if cur_text[0].startswith('{"project":'):
              cur_pipeline_json = cur_text[0]
    return cur_pipeline_json

  def save_project(data):
    """Puts the given project json data into the given div.

    The content of the div will be persisted in notebook.
    """
    with output.redirect_to_element('#pipeline-output'):
      js('document.body.querySelector("#pipeline-output").innerHTML = ""')
      html(data)

  def show_app():
    """Shows the web app."""
    embed(port, height)

  def show_controls():
    html('''<style>
    #pipeline-output-title {
      margin-top: 12px;
    }

    #pipeline-output {
      color: #999;
      font-size: 11px;
      margin: 4px 0;
      max-height: 36px;
      overflow-y: auto;
      margin-bottom: 12px;
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      padding: 8px;
      border-radius: 4px;
    }

    #pipeline-message {
      font-size: 14px;
      padding: 8px;
      background-color: #ffefe1;
      color: #99730a;
      border: 1px solid #99730a;
      border-radius: 4px;
      width: fit-content;
    }
  </style>''')
    html('<div id="pipeline-output-title">Saved pipeline:</div>')
    html('<div id="pipeline-output">N/A</div>')
    html('<div id="pipeline-message"></div>')
    js('''
    const msgEle = document.querySelector('#pipeline-message');
    if (!google.colab.kernel.accessAllowed) {
      msgEle.style.display = 'block';
      msgEle.textContent = 'ⓘ To start, run the cell above with `visualblocks.Server` first then run this cell.'
    } else {
      msgEle.style.display = 'none';
      google.colab.kernel.invokeFunction('showApp', [], {});
    }
  ''')
    html('<div id="ui-container"></div>')

  # Register callback for saving project.
  output.register_callback('saveProject', save_project)
  output.register_callback('showApp', show_app)

  # Start background server.
  port = portpicker.pick_unused_port()
  threading.Thread(target=app.run, kwargs={'host':'::','port':port}).start()

  # Read the saved pipeline json.
  pipeline_json = read_pipeline_json_from_notebook()

  # A thin wrapper class for exposing a "display" method.
  class _Server:
    def display(self):
      show_controls()
      if pipeline_json:
        save_project(pipeline_json)

  return _Server()
