<?php
header('Content-Type: application/json');
include ('./functions.php');
if($_POST['tipo'] == 'envio')
    echo core();
else if($_POST['tipo'] == 'verificar_registro'){
    echo verifica();
}
else if($_POST['tipo'] == 'verificar_quantidade'){
    echo restante();
}
?>