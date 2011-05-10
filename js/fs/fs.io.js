/**
 * License
 *
 *(The MIT License)
 *
 * Copyright (c) 2011 Anton Podviaznikov <podviaznikov@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
"use strict";
fs.io = Object.create({},
{

    /* Files and Directories*/

    createFile:
    {
        value:function(fileName,callback)
        {
            fs.util.getFileFromRoot(fileName,callback,{});
        }
    },
    createTmpFile:
    {
        value:function(fileName,callback)
        {
            fs.util.getFileFromRoot(fileName,callback,{tmp:true});
        }
    },

    createDirectory:
    {
        value:function(directoryName,callback)
        {
            fs.util.getDirectoryFromRoot(directoryName,callback,{});
        }
    },

    createTmpDirectory:
    {
        value:function(directoryName,callback)
        {
            fs.util.getDirectoryFromRoot(directoryName,callback,{tmp:true});
        }
    },



    /*Directories*/
    readDirectory:
    {
        value:function(directoryName,callback)
        {
            fs.util.getDirectory(directoryName,function(err,directory)
            {
                if(err)
                {
                    callback(err);
                }
                else
                {
                    fs.util.readEntriesFromDirectory(directory,callback);
                }
            },{});
        }
    },

    readRootDirectory:
    {
        value:function(callback)
        {
            fs.getNativeFS(function(err,filesystem)
            {
                if(err)
                {
                    callback(err);
                }
                else
                {
                    fs.util.readEntriesFromDirectory(filesystem.root,callback);
                }
            },{});
        }
    }
});

