function GenerateColor(){
    //背景颜色随机
    var x=Math.floor((Math.random()*100+1));
    var y=Math.floor((Math.random()*100+1));
    var z=Math.floor((Math.random()*100+1));
    $("#Imageid").css({
        "background-color":"#"+x+y+z
    });
    $("#ImageClone").css({
        "background-color":"#"+x+y+z
    });

    //图标随机
    var num=parseInt(Math.random()*10);
    
    // var img = "https://img.alicdn.com/bao/uploaded/TB1qimQIpXXXXXbXFXXSutbFXXX.jpg";
    var img ="imgs/"+num+".png"
    
    var image = new Image();
    image.crossOrigin = '';
    image.src = img;
    image.onload = function(){
        var base64 = getBase64Image(image);
        $("img").attr("src",base64);
        cutDiv();
    } 
}
function GetBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        var dataURL = canvas.toDataURL("image/"+ext);
        return dataURL;
        }

function cutDiv(){
    html2canvas($("#Imageid"),{
        useCORS:true,
        onrendered:function(canvas){
            var url=canvas.toDataURL();
            $("#ImageDown").append(canvas);
        }
    });
} 

// function cutDiv(){
//     // html2canvas($("#Imageid")).then(canvas => {
//     //     $("#ImageDown").append(canvas)
//     // }); 
//     domtoimage.toPng($("#Imageid"))
//     .then(function (dataUrl) {
//         var img = new Image();
//         img.src = dataUrl;
//         document.body.appendChild(img);
//     });  
// } 

function GetBase64(img){
    var canvas=document.createElement('canvas');
    canvas.width=img.width;
    canvas.height=img.height;
    var ctx=canvas.getContext("2d");
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    var dataurl=canvas.toDataURL();
    return dataurl;
}
//实现将项目的图片转化成base64
function convertImgToBase64(url, callback, outputFormat){
   var canvas = document.createElement('CANVAS'),
　　ctx = canvas.getContext('2d'),
　　img = new Image;
　　img.crossOrigin = 'Anonymous';
　　img.onload = function(){
    　　canvas.height = img.height;
    　　canvas.width = img.width;
    　　ctx.drawImage(img,0,0);
    　　var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    　　callback.call(this, dataURL);
    　　canvas = null; 
    };
　　img.src = url;
} 

//改变背景宽度
function ChangeWidth(width){
    $("#Imageid").width(width);
}
//改变背景高度
function ChangeHeight(height){
    $("#Imageid").height(height);
}
//改变背景色
function ChangeColor(bgcolor){
    $("#Imageid").css("background-color",bgcolor);
}
//图标
function ChangeIcon(bgicon){
    $('#ImageBgicon').attr("src", bgicon);
}
//改变图标宽度
function ChangeIconWidth(iconwidth){
    $("#ImageBgicon").width(iconwidth);
}
//改变图标高度
function ChangeIconHeight(iconheight){
    $("#ImageBgicon").height(iconheight);
}

//绘制图像
function DownLoad(){
    var width=$("#bgwidth").val();
    var height=$("#bgheight").val();
    var bgcolor=$("#bgcolor").val();

    var img=document.getElementById("ImageBgicon");
    var imgbase64="";
    
    var image = new Image();
    image.crossOrigin = '';
    image.src = img.src;
    // console.log(img.src);
    image.onload = function(){
        if(!img.src.indexOf("base64"))
        {
            imgbase64 = GetBase64Image(image);
            image.src=imgbase64;
        }
    }

    var canvas = document.createElement('canvas');
    canvas.id = "BackCanvas";
    canvas.width = width;
    canvas.height = height;
    canvas.style.zIndex = 8;
    var ctx=canvas.getContext("2d");
    ctx.fillStyle=bgcolor;
    ctx.fillRect(0,0,width,height);
    ctx.drawImage(img,(width-img.width)/2,(height-img.height)/2,img.width,img.height);
    // document.body.appendChild(canvas);
    var imgdata=canvas.toDataURL();
    var date=new Date();
    // console.log(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"-"+date.getTime());
    var filename=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"-"+date.getTime()+".png";
    savaImage(imgdata,filename);


}
//将图像保存到本地
function savaImage(data,filename)
{
    var save_link = document.createElement('a');
    // var save_link=document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href=data;
    save_link.download=filename;
    save_link.click();
    // var event=document.createEvent('MouseEvents');
    // event.initMouseEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
    // save_link.dispatchEvent(event);
};
//上传图片
function ChangeLocalIcon(e){
    var reader=new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload=function(){
        var imagedata=reader.result;
        $("#ImageBgicon").attr("src",imagedata);
    };
}
//重制
function Reset(){
   $("div input").val("");
}