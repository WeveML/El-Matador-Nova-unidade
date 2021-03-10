<?php
header('Content-Type: application/json');
//include(__DIR__."/../phpmailer/PHPMailerAutoload.php");
require('db.php');
function voucher(){
    $chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $res = "";
    for ($i = 0; $i < 9; $i++) {
        $res .= $chars[mt_rand(0, strlen($chars)-1)];
    }
    return $res;
}

function total(){
    $conexao= Conexao::getConnection();
    $query = $conexao->prepare("SELECT SUM(quantidade) as total2 FROM conf");
    $query->execute();
    $resul = $query->fetch();
    return $resul['total2'];

}

function produtos(){
    $conexao= Conexao::getConnection();
    $query = $conexao->prepare("SELECT * FROM conf");
    $query->execute();
    $resul = $query->fetchall();
    return $resul;
}


function probabilidade(){
    $elementos = produtos();
    $funcao = function($value) {
        $percentual = $value['quantidade']/total()*100;
        return array("produto" => $value['produto'], 'percentual'=> $percentual);
    };
    $novo = array_map($funcao, $elementos);
    return $novo;
}

function montar_array(){
    $array_porcentagem = array();
    foreach(probabilidade() as $new){
        for($i=0; $i<intval($new['percentual']);$i++){
            array_push($array_porcentagem, $new['produto']);
        }
    }
    shuffle($array_porcentagem);
    return $array_porcentagem;
}

function produto_gerado(){
    $random = rand(0,98);
    $array = montar_array();
    $valor = $array[$random];
    return $valor;
}

function subtrair_total($gerado){
    $conexao= Conexao::getConnection();
    $query = $conexao->prepare("UPDATE conf SET quantidade= quantidade -1 WHERE produto = '$gerado'");
    $query->execute();
}

function adicionar_registro($codigo,$gerado){
        $ip = '';
        $conexao= Conexao::getConnection();
        $query = $conexao->prepare("INSERT INTO registros (cpf,voucher,premio,email,ip) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?
        )
        ");
        $query->bindParam(1, $_POST['cpf']);
        $query->bindParam(2, $codigo);
        $query->bindParam(3, $gerado);
        $query->bindParam(4, $_POST['email']);
        $query->bindParam(5,$ip);
        $query->execute();
}

function core(){
    $gerado = produto_gerado();
    $codigo = voucher();
    subtrair_total($gerado);
    adicionar_registro($codigo,$gerado);
    return '{"sucesso":"ok","gerado":"'.$gerado.'", "voucher":"'.$codigo.'"}';
}


function verifica(){
    $conexao= Conexao::getConnection();
    $query=$conexao->prepare("SELECT * FROM registros WHERE cpf = :cpf OR email = :email LIMIT 1");
    $query->bindParam(':cpf', $_POST['cpf']);
    $query->bindParam(':email', $_POST['email']);
    $query->execute();
    $resul = $query->rowCount();
    if($resul == 0)
        return '{"existe":"false"}';
    else
        return '{"existe":"true"}';
}
function restante(){
    $conexao= Conexao::getConnection();
    $query=$conexao->prepare("SELECT SUM(quantidade) AS qtd FROM conf");
    $query->execute();
    $resul = $query->fetch();
    $resul = $resul['qtd'];
    if($resul <= 0)
        return '{"acabou":"true"}';
    else
        return '{"acabou":"false"}';
}
?>