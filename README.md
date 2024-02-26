# Frontend Home Exercise Detailed Spec

The task is to create a Computer Vision data exploration application

# Data

The dataset we will use: 

[Bone Fracture Detection: Computer Vision Project](https://www.kaggle.com/datasets/pkdarabi/bone-fracture-detection-computer-vision-project)

The dataset is available on S3: `s3://dataspan.frontend-home-assignment/bone-fracture-detection/` 

Contents:

- `test/`, `train/`, `valid/` : each is a directory containing:
    - `images/` : containing JPG images
    - `thumbnails/` : a 100x100 image thumbnail.
    - `labels/`: contains a TXT file for each JPG image (same filename). These are in the  [YOLO format](https://roboflow.com/formats/scaled-yolov4-txt) (see the “EXAMPLE” tab). Basically, each line describes a single polygon: the first number is the class index (starting at 0) and the rest of the line are the (x, y) coordinates of the polygon vertices (corners).
- data.yaml: `nc` is number of classes, `names` are the class names. Ignore the rest
- `README.dataset.txt` : Ignore

<aside>
💡 This dataset contains over 4k images. For the purposes of this exercise, limit the number of images from each folder (e.g. `train` ) to 200.

</aside>

To access the files you can use AWS Javascript SDK. Here is a simple HMTL with Javascript that uses the SDK

- `index.html`
    
    ```json
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://sdk.amazonaws.com/js/aws-sdk-2.1555.0.min.js"></script>
      </head>
      <body>
        <h1>Photo Album Viewer</h1>
        <div id="viewer" />
      </body>
    
    <script>
    var albumBucketName = "dataspan.frontend-home-assignment";
    
    AWS.config.region = "eu-central-1"; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "eu-central-1:31ebe2ab-fc9d-4a2c-96a9-9dee9a9db8b9",
    });
    
    var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: albumBucketName },
    });
    
    // A utility function to create HTML.
    function getHtml(template) {
      return template.join("\n");
    }
    
    // List the photo albums that exist in the bucket.
    function listAlbums() {
      s3.listObjects({ Delimiter: "/" }, function (err, data) {
        if (err) {
          return alert("There was an error listing your albums: " + err.message);
        } else {
          var albums = data.CommonPrefixes.map(function (commonPrefix) {
            var prefix = commonPrefix.Prefix;
            var albumName = decodeURIComponent(prefix.replace("/", ""));
            return getHtml(["<li>", '<button style="margin:5px;" onclick="viewAlbum(\'' + albumName + "')\">", albumName, "</button>", "</li>",]);
          });
          var message = albums.length ? getHtml(["<p>Click on an album name to view it.</p>"]) : "<p>You do not have any albums. Please Create album.";
          var htmlTemplate = ["<h2>Albums</h2>", message, "<ul>", getHtml(albums), "</ul>",];
          document.getElementById("viewer").innerHTML = getHtml(htmlTemplate);
        }
      });
    }
    
    // Show the photos that exist in an album.
    function viewAlbum(albumName) {
      var albumPhotosKey = encodeURIComponent(albumName) + "/";
      s3.listObjects({ Prefix: albumPhotosKey }, function (err, data) {
        if (err) {
          return alert("There was an error viewing your album: " + err.message);
        }
        // 'this' references the AWS.Request instance that represents the response
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + albumBucketName + "/";
    
        var photos = data.Contents.map(function (photo) {
          var photoKey = photo.Key;
          var photoUrl = bucketUrl + encodeURIComponent(photoKey);
          return getHtml(["<span>", "<div>", "<br/>", '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>', "</div>", "<div>", "<span>", photoKey.replace(albumPhotosKey, ""), "</span>", "</div>", "</span>",]);
        });
        var message = photos.length ? "<p>The following photos are present.</p>" : "<p>There are no photos in this album.</p>";
        var htmlTemplate = ["<div>", '<button onclick="listAlbums()">', "Back To Albums", "</button>", "</div>", "<h2>", "Album: " + albumName, "</h2>", message, "<div>", getHtml(photos), "</div>", "<h2>", "End of Album: " + albumName, "</h2>", "<div>", '<button onclick="listAlbums()">', "Back To Albums", "</button>", "</div>",];
        document.getElementById("viewer").innerHTML = getHtml(htmlTemplate);
        document.getElementsByTagName("img")[0].setAttribute("style", "display:none;");
      });
    }
    
    listAlbums();
    </script>
    </html> 
    ```
    

# Design

Fignma project: https://www.figma.com/file/xL8xMTV6e4eUkz1UtrFI3d/dataspan.ai-home-exercise?type=design&node-id=163%3A2919&mode=design&t=xxUfoG91XAfJACKy-1

Figma dev mode link: https://www.figma.com/file/xL8xMTV6e4eUkz1UtrFI3d/dataspan.ai-home-exercise?type=design&node-id=163%3A2919&mode=dev&t=xxUfoG91XAfJACKy-1

## Layout

The app is a single page. No login screen is required.

![Home assignment_Value.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d1115d08-38c7-4a35-a3e3-e3a83c62d818/6e7190aa-2b13-453a-9dd1-937b0fe67a5f/Home_assignment_Value.png)

### Main Pane

- Dataset name is on the top.
- Total number of images displayed in the upper right.
- Images are in the center main pane - these are thumbnails. Have the number of image rows an columns configurable parameters (not visible to the user). Images are sorted lexicographically based on filename
- There are 4 tabs, 3 for each of the folders (”Train”, etc.) of the data and one tab for all combined (”All Groups”).
- Bellow each image is the filename. If the file name exceeds the width then terminate with an ellipsis `…` and have the full name displayed in a tooltip on hover
- Over each image, overlay any polygons associated with that image. The polygons should be in the respective class color. The name of each class should be shown on top.
- If the number of displayed images is greater than the allowed space then use pagination:
    - If only a few pages then
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d1115d08-38c7-4a35-a3e3-e3a83c62d818/e1335768-b3c3-4695-8539-4ce8274f0270/Untitled.png)
    
    - If many pages then
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d1115d08-38c7-4a35-a3e3-e3a83c62d818/d1b21a0f-3819-4565-b3fb-b0467dbefc44/Untitled.png)
    
- When an image is clicked a pop-up appears - this is the full-sized image (not a thumbnail)
    
    ![Home assignment_pop_up (1).png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d1115d08-38c7-4a35-a3e3-e3a83c62d818/0725026b-0eca-4563-9102-a9e076309b86/Home_assignment_pop_up_(1).png)
    

### Left Pane (filters)

Class filter:

A toggle button for each class, with it’s color. When a toggle is on, then all images with a polygon belonging to that class are displayed. Select all turns al toggle on, Deselect all turns all toggles off. Note: this filter does not affect images with 0 polygons - meaning that they are always considered ON when it comes to this filter (but not others)

Polygon count filter:

Two sided integer number ranging from 0 (no polygons) to 4 (or more). Only images with a number of polygons that fall within the range are displayed.

# Implementation Prioritization

You are not supposed to spend more than a full workday on this task. If you have less time to work on it, please work through these priorities. Also, add an `alert()` on your delivered website specifying how many hours you spent on it.

1. Basic layout
2. Overlay polygons on images (details like color and class name can be deferred for later)
3. Images grid (names and tooltip can be deferred for later)
4. Tabs and image count
5. Filters (colors can be saved for later)
6. Image popup

# Delivery

The website needs to be hosted somewhere to be available for independent review.