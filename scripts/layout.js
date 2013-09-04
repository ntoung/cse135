	
	/* 
	 * window.onload
	 *
	 * Post Condition:
	 * if not able to locate jQuery, return error
	 *
	 * else launch dropdown menu twitter bootstrap
	 *
	 */
    window.onload = function()
    {
        /* corner case, jQuery failed */
        if(!window.jQuery)
        {
            alert('jQuery not loaded');
        }
        else
        {
            /* call dropdown js */
            $(document).ready(function(){
                $('.dropdown-toggle').dropdown();
            });
        }
    }