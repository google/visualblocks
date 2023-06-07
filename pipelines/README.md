<!-- go/markdown -->

# Creator Guide for Visual Blocks

Thank you creators for contributing to Visual Blocks for ML! We firmly believe
that: with your contribution, we can inspire more hackers, designers, and
practitioners unleash their creativity!

## Contributing a New Pipeline

First, fork this repository and clone the forked repo to your laptop or
workstation. Review and sign the
[Contributor License Agreement](https://cla.developers.google.com/about) (CLA).
Now you are ready to create a pull request!

Second, visit https://visualblocks.withgoogle.com/, click the `Demo` button.
Next, click the `Demo: Create Your Own` tab and start dragging and dropping
nodes from the node gallery and make your own pipelines. After you complete,
come up with a descriptive title, and click the `Export` button on the top right
corner to download. You may also click the `Import` button to load an existing
pipeline.

Finally, copy the downloaded your pipeline to your local repository, commit and
create a pull request by following
[the official GitHub guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).
We strongly recommend contributors to also upload a GIF or JPG screenshot for
your pipeline (width: 320px) to be featured in this guide.

After you have uploaded your pipeline to the `pipelines` folder, you can easily
share your amazing creation via URL like:
https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fgraphics%2F3dphoto_portrait_depth.json

## Example Pipelines

Please refer to `graphics%2F3dphoto_portrait_depth.json` and `palm2_weather_summarizer.json`
for two example pipelines. Note that API keys and locally uploaded images are
not exported for privacy and security.

Before you get started on the PaLM example, you need to get an API key first.
Head to makersuite.google.com, sign up with your Google account, and click "Get
an API key". Once you have the key, you can start using the API.

## Visual Blocks Gallery

We highlight a set of community-contributed pipelines of Visual Blocks below:

### Interactive Graphics

*   [3D Photo](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fgraphics%2F3dphoto_portrait_depth.json)
    with
    [Portrait Depth API](https://blog.tensorflow.org/2022/05/portrait-depth-api-turning-single-image.html?linkId=8063793)

    [![3D Effects with Portrait Depth API in Visual Blocks](graphics/3dphoto_portrait_depth.gif)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fgraphics%2F3dphoto_portrait_depth.json)


*   [AR Sticker Effect](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fwebcam%2Far_sticker_effect.json)
    with
    [Mediapipe Face Landmark Detection](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)

    [![AR Sticker Effect in Visual Blocks](webcam/ar_sticker_effect.gif)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fwebcam%2Far_sticker_effect.json)

### Natural Language Understanding

*   [Weather Summarizer](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_weather_summarizer.json)
    with
    [PaLM API](https://developers.generativeai.google)

    [![Weather Summarizer with PaLM API](llm/palm2_weather_summarizer.jpg)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_weather_summarizer.json)


*   [LaTeX Manuscript Helper](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_manuscript_helper.json)
    with
    [PaLM API](https://developers.generativeai.google)

    [![LaTeX Manuscript Helper](llm/palm2_manuscript_helper.jpg)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_manuscript_helper.json)


*   [Werewolf Game](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_werewolf.json)
    with
    [PaLM API](https://developers.generativeai.google)

    [![Werewolf Game](llm/palm2_werewolf.jpg)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_werewolf.json)

*   [Review Generation and Rating](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Freview_generation_and_rating.json) with GPT3.5

    [![Review Generation and Rating](llm/review_generation_and_rating.jpg)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Freview_generation_and_rating.json)


*   [Email tones explorer](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_email_tones_explorer.json)
    with
    [PaLM API](https://developers.generativeai.google)

    [![Email tones explorer](llm/palm2_email_tones_explorer.jpg)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_email_tones_explorer.json)

*   [Email genereation review](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_email_generation_review.json)
    with
    [PaLM API](https://developers.generativeai.google)

    [![palm2_email_generation_review](llm/palm2_email_generation_review.jpg)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_email_generation_review.json)

### Image Processing

*   [Low Light Enhancement](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fvision%2Flow_light_enhancement.json)

    [![Low Light Enhancement in Visual Blocks](vision/low_light_enhancement.jpg)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fvision%2Flow_light_enhancement.json)

*   [CartoonGAN](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fgraphics%2Fcartoongan.json)

    [![CartoonGAN in Visual Blocks](graphics/cartoongan.jpg)](https://visualblocks.withgoogle.com/#/demo?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fgraphics%2Fcartoongan.json)


## Community Guidelines

This project follows
[Google's Open Source Community Guidelines](https://opensource.google/conduct/).
