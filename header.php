<?php
    function spa_root(){
        return '
            <div id="yugal-root"></div>
        ';
    }
    function spa_preloader($preloader){
        return '
            <div id="yugal-root">'.$preloader.'</div>
        ';
    }
?>
<script src="./lib/yugal_spa/yugal.js"></script>
<link rel="stylesheet" href="./lib/yugal_spa/yugal.css">