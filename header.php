<?php
    function spa_root($preload = ""){
        return "
            <div id=\"yugal-root\">$preload</div>
            <style id=\"yugal-style\"></style>
            <style id=\"yugal-page-specific-style\"></style>
        ";
    }
    function spa_preloader($preloader){
        return '
            <div id="yugal-root">'.$preloader.'</div>
            <style id="yugal-page-specific-style"></style>
            <style id="yugal-style"></style>
        ';
    }
    function create_spa(){
        $root = project_root();
        echo "<script src=\"$root/lib/yugal_spa_lib/yugal.js\"></script>";
    }
?>
<link rel="stylesheet" href="<?php echo project_root(); ?>/lib/yugal_spa_lib/yugal.css">
