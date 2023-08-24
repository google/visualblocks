# Visual Blocks Pipelines Submission

Thank you creators for contributing to Visual Blocks for ML! We firmly believe
that with your contribution, we can inspire more hackers, designers, and
practitioners to unleash their creativity! Let's make AI/ML accessible to 
everyone so they may bring their ideas to life faster.

## Contributing a New Pipeline

### Step 1: Clone this repository and sign contributor agreement

Fork this repository and clone the forked repo to your laptop or workstation.
Review and sign the
[Contributor Licence Agreement](https://cla.developers.google.com/about) (CLA).
Now you are ready to create a pull request :)


### Step 2: Create Your Pipeline

Visit https://visualblocks.withgoogle.com, click the `Demo` button. Next, click
the `Demo: Create Your Own` tab at the top right and start dragging and dropping 
nodes from the node panel on the bottom left to make your own pipelines that
solve some problem or idea you have in mind.

Note: You may also click the `Import` button to load an existing pipeline to 
iterate on what someone else has already created to make something new.

Once you have a working pipeline, click the `Export` button on the top right 
corner to download as json file containing your pipeline configuration.
Fill out any other metadata if asked. 

**Note:** API keys and locally uploaded images are not exported for privacy and security.
If you make use of such items you may want to create a tutorial video and share that with
your submission in step 4, part 4.


### Step 3: Preparing your pipeline for submission to the community

In order for your pipeline to be accepted you must follow these rules:

1. Create a new folder for your custom pipeline within this repositories'
   `pipelines` folder

2. Ensure the name of this new folder is the name of your pipeline. For example
   if you decide to call your pipeline "Cat on table detector" then name your
   folder  `cat_on_table_detector` all lowercase, with underscores between words.

3. Inside this folder you have created ensure you add the following files:

   a) **name_of_pipeline.json** (*required*) The JSON file you downloaded when you
   exported your pipeline from visual blocks. Be sure to name it in the same
   way as the folder, for our example above it would be `cat_on_table_detector.json`.
   
   b) **name_of_pipeline.jpg** (*required*) A high resolution JPG image that is 1280x720
   pixels in size (16:9 ratio) showing a key snapshot of the Visual Blocks pipeline
   you created in action. This will be shown in search results on the visual blocks
   community pipelines page.
   
   c) **name_of_pipeline.mp4** (*optional*) If you are feeling creative, you can make a
   short up to 15 seconds max, MP4 video (with no sound) showing the pipeline in action. If
   you do this, we shall use this once we support it, to enhance your search result with a looped video of   
   your pipeline in action, which may encourage more users to try your pipeline out. Video
   Must be 640x480 pixels in size and no greater than 4MB in filesize.
   

### Step 4: Add metadata to the JSON file

Next, edit the pipeline JSON file in your favourite text editor.

There will be a lot of data about your pipeline in this file, however you will notice that
near the top there will be an object named `project`. Inside of this object there will be a field called `name`:

1. **name** (*required*) - the public human readable title of your pipeline. For example "Cat on table detector"

Next, further down, you will find an object named `userSetData` within which the following fields have been created that you must fill out:

1. **description** (*required*) - maximum 200 words to describe what your pipeline does. The description should be as **clear and concise** as possible. We encourage contributors to follow the two guidelines below:

  * G1: The description should **explicitly** explain **what** the pipeline does.
  * G2: The description should NOT explain **how** the pipeline does it.

    For instance, for the [weather summarizer](https://visualblocks.withgoogle.com/#/edit/_project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fllm%2Fpalm2_weather_summarizer.json) pipeline:

    &#9745; "Summarize the weather in a specified city into in one sentence." - a good example

    &#9746; "Weather summarizer" - a description that is too general and ambiguous [violating P1]

    &#9746; "Get the weather in specified city first, and then use PaLM to summarize the generated content into one sentence." - a description that includes too many unnecessary technical details [violating P2]

2. **tags** (*required*) - An array of strings containing one or more of the following possible tags:
     * text
     * vision
     * other

   For example, if your pipeline was solely around vision, you would just enter `[“vision"]` for this field.
   If your pipeline covered multiple areas, for example a Gen AI text to image pipeline's categories might be `["vision”, “text"]` as the string array for this field.

3. **contactURL** (*required*) - Your pipeline's Github URL so people can submit a bug if your pipeline stops working or suggest features.
   
4. **tutorialYouTube** (*optional*) The URL to a YouTube video you have created that shows in more detail how to use your created pipeline. Should be in the form of “https://www.youtube.com/watch?v=YTVideoID”


### Step 5: Create a pull request to submit your pipeline files

Now that your files are created and configured correctly, commit and create a pull request by following
[the official GitHub guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).


### Reviews
Submissions will be reviewed by repo managers to ensure compliance with [Google’s Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy?hl=en-US). Please do not submit any pipelines that contain sensitive or personal information.


### Share your creation

After you have uploaded your pipeline to the `pipelines` folder, you can easily
share your amazing creation via URL like:
https://visualblocks.withgoogle.com/#/edit/_?project_json=https:%2F%2Fraw.githubusercontent.com%2Fgoogle%2Fvisualblocks%2Fmain%2Fpipelines%2Fgraphics%2F3dphoto_portrait_depth.json


## Visual Blocks Gallery

Succesfully merged pull requests shall be viewable and searchable on the main Visual Blocks website under the community tab typically within 1 week of being merged.


## Community Guidelines

This project follows [Google's Open Source Community Guidelines](https://opensource.google/conduct/).

If you have any questions or suggestions for Visual Blocks submissions contact [Jason Mayes](https://linkedin.com/in/WebAI).
