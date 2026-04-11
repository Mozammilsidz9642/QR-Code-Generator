let qrInput = document.getElementById("qrInput");
let userInput = document.getElementById("userInput");
let logoInput = document.getElementById("logoInput");
let qrBox = document.getElementById("qr-box");
let usernameDisplay = document.getElementById("usernameDisplay");

let logoData = "";

//  LOGO 
logoInput.addEventListener("change", function(){
  let file = this.files[0];

  if(file){
    let reader = new FileReader();

    reader.onload = function(e){
      logoData = e.target.result;
    }

    reader.readAsDataURL(file);
  }
});

//  GENERATE QR 
function generateQR(){

  let link = qrInput.value.trim();
  let user = userInput.value.trim();

  if(!link){
    alert("Enter link!");
    return;
  }

  // auto https 
  if(!link.startsWith("http")){
    link = "https://" + link;
  }

  qrBox.innerHTML = "";

  let qr = new QRCodeStyling({
    width: 500,
    height: 500,
    data: link,

    image: logoData,

    dotsOptions: {
      type: "rounded",
      gradient: {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#0f2027" },
          { offset: 1, color: "#2c5364" }
        ]
      }
    },

    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#0f2027"
    },

    backgroundOptions: {
      color: "#ffffff"
    },

    imageOptions: {
      crossOrigin: "anonymous",
      margin: 8
    }
  });

  qr.append(qrBox);

  usernameDisplay.innerText = user
    ? (user.startsWith("@") ? user : "@" + user)
    : "@username";
}

//  DOWNLOAD 
function downloadQR(){

  let qrCanvas = document.querySelector("#qr-box canvas");

  if(!qrCanvas){
    alert("Generate QR first!");
    return;
  }

  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  //  ULTRA HD
  canvas.width = 1400;
  canvas.height = 1600;

  // background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let qrSize = 800;
  let qrX = (canvas.width - qrSize)/2;
  let qrY = 250;

  // draw QR
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // username
  ctx.fillStyle = "#000";
  ctx.font = "bold 70px Arial";
  ctx.textAlign = "center";

  let text = usernameDisplay.innerText;

  ctx.fillText(text, canvas.width/2, qrY + qrSize + 120);

  //  UNIVERSAL DOWNLOAD 
  let image = canvas.toDataURL("image/png");

  let link = document.createElement("a");
  link.href = image;
  link.download = "Pro_QR.png";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 📱 MOBILE fallback
  setTimeout(()=>{
    window.open(image, "_blank");
  }, 500);
}

//  CLEAR
function clearQR(){
  qrInput.value = "";
  userInput.value = "";
  qrBox.innerHTML = "";
  usernameDisplay.innerText = "@username";
  logoData = "";
}