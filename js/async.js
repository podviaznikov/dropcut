"use strict";
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
