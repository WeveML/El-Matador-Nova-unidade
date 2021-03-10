<?php
define('DB_HOST'        , "localhost");
define('DB_USER'        , "root");
define('DB_PASSWORD'    , "");
define('DB_NAME'        , "el_matador");
/*
define('DB_HOST'        , "localhost");
define('DB_USER'        , "elmatador_admin");
define('DB_PASSWORD'    , "@MartinLuz011");
define('DB_NAME'        , "elmatador_new");
*/

class Conexao
{
    private static $connection;
    public static function getConnection() {
        try {
            if(!isset($connection)){
                $connection = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.'', DB_USER, DB_PASSWORD);
                //$connection =  new PDO($pdoConfig, DB_USER, DB_PASSWORD);
                $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            return $connection;
         } catch (PDOException $e) {
            $mensagem .= "\nErro: " . $e->getMessage();
            throw new Exception($mensagem);
         }
     }
}
?>