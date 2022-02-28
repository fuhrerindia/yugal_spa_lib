# Yugal.JS in Yugal.PHP (SPA)
You can install `Yugal.JS` a *Single Page App Module* in `Yugal.PHP`.
Run command below in your project folder.

```bash
yugal --install https://github.com/sinhapaurush/yugal_spa_lib.git
```
This command will install `Yugal.JS` in your `Yugal.PHP` project.
Follow steps below to configure Single Page Apps (Yugal.JS) in your project.

- In `index.php` or any landing `Yugal.PHP` file and add another `library` in `meta` function.
```php
    meta(
        array(
            "title"=>"Yugal App",
            ...
            "library"=>array(
                ...
                + "yugal_spa_lib"
            )
        )
    );
```  
In above code, `...` represents other codes, don't forget to remove `+` sign.

- Use `spa_root()` as code to render to screen.
Example
```php
    $body = spa_root();
    export_screen($body);
```
- Run `create_spa()` after exporting screen to browser and before using `end_doc()`.
Example
```php
    $body = spa_root();
    export_screen($body);
    create_spa(); //THIS function IS VERY IMPORTANT
    end_doc(
        array()
    );
```
Navigate to [Yugal.JS Documentation](https://spa.yugal.ml) to know how to use Yugal.JS.
