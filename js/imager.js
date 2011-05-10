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