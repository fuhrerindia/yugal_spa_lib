<?php
    function spa_root(){
        return '
            <div id="yugal-root"></div>
            <style id="yugal-style"></style>
        ';
    }
    function spa_preloader($preloader){
        return '
            <div id="yugal-root">'.$preloader.'</div>
            <style id="yugal-style"></style>
        ';
    }
    function create_spa(){
        echo '<script src="./lib/yugal_spa_lib/yugal.js"></script>';
    }
?>
<link rel="stylesheet" href="./lib/yugal_spa_lib/yugal.css">
