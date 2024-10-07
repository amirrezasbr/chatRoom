import services from "~/services";
import { socket } from "~/constants/socket";

let imageFile;

async function picture(id) {
  // if (!currentChatId) {
  //   alert("Please select a chat first");
  //   return;
  // }
  try {
    const video = createVideoElement();
    document.body.appendChild(video);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();

    const clickResult = await waitForVideoClick(video);

    if (!clickResult) {
      cleanupVideoCapture(stream, video);
      return;
    }

    imageFile = await captureAndCompressImage(video);

    cleanupVideoCapture(stream, video);

    const img = createImagePreview(imageFile);
    document.body.appendChild(img);

    await handleImageConfirmation(img, id);
    console.log("img", img, imageFile);
  } catch (error) {
    console.error("Error capturing image:", error);
    alert("Failed to capture image. Please try again.");
  }
}

function createVideoElement() {
  const video = document.createElement("video");
  video.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    cursor: pointer;
  `;
  return video;
}

function waitForVideoClick(video) {
  return new Promise((resolve) => {
    const handleClick = (event) => {
      document.body.removeEventListener("click", handleClick);
      resolve(event.target === video);
    };
    document.body.addEventListener("click", handleClick);
  });
}

function cleanupVideoCapture(stream, video) {
  stream.getTracks().forEach((track) => track.stop());
  document.body.removeChild(video);
}

async function captureAndCompressImage(video) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg")
  );

  const file = new File([blob], "camera_picture.jpg", { type: "image/jpeg" });
  return compressImage(file, 512);
}

function createImagePreview(imageFile) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(imageFile);
  img.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    cursor: pointer;
    max-width: 90%;
    max-height: 90%;
  `;
  return img;
}

function handleImageConfirmation(img, id) {
  return new Promise((resolve) => {
    const handleSecondClick = (event) => {
      if (event.target === img) {
        const data = new FormData();
        data.append("chatId", id);
        data.append("file", imageFile);

        services.file
          .upload(data)
          .then((response) => {
            const message = {
              chatId: id,
              content: response.data.filename,
              contentType: "image",
            };
            socket.emit("message", message);
            imageFile = null;
            document.body.removeChild(img);
            document.removeEventListener("click", handleSecondClick);
            resolve();
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        imageFile = null;
        document.body.removeChild(img);
        document.removeEventListener("click", handleSecondClick);
        resolve();
      }
    };

    document.addEventListener("click", handleSecondClick);
  });
}
async function compressImage(file, maxSize) {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          1
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
export { picture };
