// DropCut
// (c) 2011 Enginimation Studio (http://enginimation.com).
// DropCut may be freely distributed under the MIT license.
// For all details and documentation:
// https://github.com/podviaznikov/dropcut
"use strict";
var AppController=
{
	init:function()
	{
	    this.optionsView=new ui.OptionsView;
	    this.outputView = new ui.OutputView;
		this.uploadView=new ui.UploadPictureView;
	}
};
var ui={};
$(function()
{
    ui.UploadPictureView = Backbone.View.extend(
    {
        el:$('#drop_zone'),
        events:
        {
            'dragover':'dragOverFiles',
            'drop':'dropFiles'
        },
        render: function()
        {
           return this;
        },
        dragOverFiles: function(e)
        {
            e.stopPropagation();
            e.preventDefault();
        },
        dropFiles: function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            this.handleFileSelect(e.originalEvent.dataTransfer.files); // handle FileList object.
        },
        handleFileSelect:function(files)
        {
            $(this.el).html("Processing... We'll notify you when resizing is done");
            var self=this;
            var desiredFileName=AppController.optionsView.desiredFileName();
            var desiredSizes = AppController.optionsView.desiredSizes();
            // files is a FileList of File objects. List some properties.
            var output = [];
            var size = 0;
            var zip = new JSZip();
            var allFilesWriteCallback = createCallback(files.length,function()
            {
                window.webkitNotifications.createNotification('128.png', 'Done','All files resized').show();
                var zipContent = zip.generate();
                var blob=fs.base64StringToBlob(zipContent,'application/zip');
                var objURL=fsURL.createObjectURL(blob);
                window.open(objURL);
                $(self.el).html("Drop pictures here");
            });

            for (var i = 0, f; f = files[i]; i++)
            {
              // Only process image files.
              if (!f.type.match('image.*'))
              {
                continue;
              }
              size+=f.size;
              f.number=i;
              output.push(f);

              var maxWidth=desiredSizes.width;
              var maxHeight=desiredSizes.height;
              fs.read.fileAsDataURL(f,function(err,dataURL,theFile)
              {
                  var img = new Image();
                  img.onload = function()
                  {
                      var canvas = document.createElement("canvas");
                      //start
                      canvas.width=img.width;
                      canvas.height=img.height;
                      canvas.style.display = "none";
                      var ctx = canvas.getContext("2d");
                      ctx.drawImage(img, 0, 0);
                      var src = ctx.getImageData(0, 0, img.width, img.height);

                      var ratio = imageUtils.calculateRatio(img,maxWidth,maxHeight);

                      canvas.width = img.width * ratio;
                      canvas.height = img.height * ratio;
                      canvas.style.display = 'none';
                      // Copy the image contents to the canvas
                      var ctx = canvas.getContext("2d");
                      ctx.drawImage(img, 0, 0,canvas.width,canvas.height);
                      var dataString =  canvas.toDataURL('image/png');
                      var fileName=theFile.name;
                      if(desiredFileName)
                      {
                          fileName=desiredFileName+'_'+theFile.number+theFile.extension();
                      }
                      dataString=dataString.replace(/^data:image\/(png|jpg);base64,/, '')
                      zip.add(fileName, dataString, {base64: true});
                      allFilesWriteCallback();
                  }

                  img.src = dataURL;
                  document.getElementById(theFile.shortName()).innerHTML = document.getElementById(theFile.shortName()).innerHTML + ' Loaded';
              });
            }

            AppController.outputView.show();
            AppController.outputView.setFilesInfo(output);

            var sizeInMB = (size/(1024*1014)).toFixed(1);
            AppController.outputView.setTitle('You uploaded '+sizeInMB +' MB')
        }
    });


    ui.OutputView = Backbone.View.extend(
    {
        el:$('#process_info'),
        title:$('#total_size h1'),
        list:$('#list ul'),
        tpl:$('#status_tpl').html(),
        setTitle:function(title)
        {
            this.title.html(title);
        },
        show:function()
        {
            $(this.el).show();
        },
        setFilesInfo:function(files)
        {
           var html=[];
           for(var k=0;k<files.length;k++)
           {
                var file = files[k];
                html.push(_.template(this.tpl,{shortName:file.shortName(),name:file.name}));
           }
           $(this.list).html(html.join(''));
        }
    });

    ui.OptionsView = Backbone.View.extend(
    {
        el:$('#options_panel'),
        fileNamePattern:$('#fileNamePattern'),
        desiredFileName:function()
        {
            return this.fileNamePattern.val();
        },
        desiredSizes:function()
        {
            return getSelectedOption('resizing_types');
        }

    });
});

function createCallback(limit, fn)
{
    var finishedCalls = 0;
    return function()
    {
        if (++finishedCalls == limit)
        {
             fn();
        }
    };
}

function getSelectedOption(selectId)
{
    var select_list_field = document.getElementById(selectId);
    var select_list_selected_index = select_list_field.selectedIndex;
    var option = select_list_field[select_list_selected_index];
    return option.dataset;
}

var imageUtils=Object.create({},
{
    calculateRatio:
    {
        value:function(img,maxWidth,maxHeight)
        {
            var ratio = 1;

            if(img.width > maxWidth)
              ratio = maxWidth / img.width;
            else if(img.height > maxHeight)
              ratio = maxHeight / img.height;

            return ratio;
        }
    }
});
