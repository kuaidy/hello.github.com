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
function ChangeIconWidth(){
    var iconwidth=$("#bgiconwidth").val();
    var bgwidth=$("#Imageid").width();

    var Iconwidth=$("#ImageBgicon").width();
    if(iconwidth>bgwidth){
        $("#ImageBgicon").width(bgwidth);
    }else{
        $("#ImageBgicon").width(iconwidth);
    }
}
//改变图标高度
function ChangeIconHeight(iconheight){
    var iconheight=$("#bgiconheight").val();
    $("#ImageBgicon").height(iconheight);
}

//绘制图像
function DownLoad(){
    var width=$("#Imageid").width();
    var height=$("#Imageid").height();
    var bgcolor=$("#bgcolor").val();

    //获取span的宽度
    var spanwidth=$("#ImageText").width();
    var spanheight=$("#ImageText").height();

    var img=document.getElementById("ImageBgicon");
    var imgbase64="";
    
    var image = new Image();
    image.crossOrigin = '';
    image.src = img.src;

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
    ctx.drawImage(img,(width-img.width-spanwidth)/2,(height-img.height)/2,img.width,img.height);

    
    //获取文字
    var textcontent=$("#ImageText").text();
    var textsize=$("#ImageText").css("font-size");
    var textfamily=$("#ImageText").css("font-family");
    // 设置字体
    ctx.font = textsize+" "+textfamily;
    console.log(spanwidth);
    console.log(spanheight);
    console.log(textsize);
    console.log(textfamily);
    // 设置颜色
    ctx.fillStyle = $("#ImageText").css("color");
    // 设置水平对齐方式
    ctx.textAlign = "left";
    // 设置垂直对齐方式
    ctx.textBaseline = "middle";
    ctx.fillText(textcontent,((width-img.width-spanwidth)/2+img.width+15), (height)/2);

    console.log((width-img.width-spanwidth));
    console.log((height-spanheight)/2);

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

        var bgwidth=$("#Imageid").width();
        // console.log(bgwidth);
        var img = new Image();
        img.onload = function () {
            // console.log(this.width);
            if(this.width>bgwidth){
                $("#ImageBgicon").width(bgwidth);
            }
        };
        img.src=imagedata;
    };
}
//重制
function Reset(){
   $("div input").val("");
}

//选择图片类型
function ChangeItem(){
    var width=$("#ChangeType").find("option:selected").attr("data-width");
    $("#Imageid").width(width);
    $("#bgwidth").val(width);
    var height=$("#ChangeType").find("option:selected").attr("data-height");
    $("#Imageid").height(height);
    $("#bgheight").val(height);
}
//设置字体内容
function ChangeTextContent(){
    var textcontent=$("#TextContent").val();
    $("#ImageText").text(textcontent);
}
//设置字体大小
function ChangeTextSize(){
    var textsize=$("#TextSize").val();
    // console.log(textsize);
    $("#ImageText").css("font-size", textsize + "px");
}
//设置字体颜色
function ChangeTextColor(){
    var textcolor=$("#TextColor").val();
    $("#ImageText").css("color",textcolor);
}

//图标推荐
function ShowIcon(){
    $("#graybackground").css("display","flex");
    $("#iconurl").css("display","flex");
}
//颜色推荐
function ShowColor(){
    $("#graybackground").css("display","flex");
    $("#colorurl").css("display","flex");
}
//关闭图标推荐
function CloseIcon(){
    $("#graybackground").css("display","none");
    $("#iconurl").css("display","none");
    $("#colorurl").css("display","none");
}
//关闭颜色推荐
function CloseColor(){
    $("#graybackground").css("display","none");
    $("#colorurl").css("display","none");
}