<?php
session_start();
if (file_exists('../../MyDBi.php')) {
    require_once '../../MyDBi.php';
} else {
    require_once 'MyDBi.php';
}

$data = file_get_contents("php://input");

$decoded = json_decode($data);
if ($decoded != null) {
    if ($decoded->function == 'saveNoticia') {
        saveNoticia($decoded->noticia);

    } elseif ($decoded->function == 'updateNoticia') {
        updateNoticia($decoded->noticia);

    } elseif ($decoded->function == 'deleteNoticia') {
        deleteNoticia($decoded->id);

    } elseif ($decoded->function == 'saveComentario') {
        saveComentario($decoded->comentario);

    } elseif ($decoded->function == 'updateComentario') {
        updateComentario($decoded->comentario);

    } elseif ($decoded->function == 'deleteComentario') {

        deleteComentario($decoded->id);
    }
} else {

    $function = $_GET["function"];
    if ($function == 'getNoticias') {
        getNoticias();
    } elseif ($function == 'getComentarios') {
        getComentarios();
    }

}


function getComentarios()
{
    $db = new MysqliDb();
    $results = $db->rawQuery('SELECT noticia_comentario_id,
    noticia_id,
    titulo,
    detalles,
    parent_id,
    creador_id,
    0 creador,
    votos_up,
    votos_down,
    fecha
FROM arielces_uiglp.noticias_comentarios;
');

    foreach ($results as $key => $row) {
        $db->where('cliente_id', $row['creador_id']);
        $cliente = $db->get('cliente');
        $results[$key]['creador'] = $cliente;
    }
    echo json_encode($results);
}


function deleteComentario($comentario_id)
{

    $db = new MysqliDb();

    $db->where("noticia_comentario_id", $comentario_id);
//    $db->where("parent_id",  $comentario_id);
    $results = $db->delete('noticias_comentarios');

    echo json_encode($results);
}

function updateComentario($comentario)
{
    $db = new MysqliDb();

    $decoded = json_decode($comentario);

    $db->where('noticia_comentario_id', $decoded->noticia_comentario_id);

    $data = array("titulo" => $decoded->titulo,
        "detalles" => $decoded->detalles,
        "parent_id" => $decoded->parent_id,
        "votos_up" => 0,
        "votos_down" => 0);

    $results = $db->update('noticias_comentarios', $data);

    if (!$results) {
        echo json_encode($db->getLastError());
        return;
    }

    echo json_encode(1);
}

function saveComentario($comentario)
{
    $db = new MysqliDb();

    $decoded = json_decode($comentario);


    $data = array("noticia_id" => $decoded->noticia_id,
        "titulo" => $decoded->titulo,
        "detalles" => $decoded->detalles,
        "parent_id" => $decoded->parent_id,
        "creador_id" => $decoded->creador_id,
        "votos_up" => 0,
        "votos_down" => 0);

    $results = $db->insert('noticias_comentarios', $data);

    if ($results == false || $results < 0) {
        echo json_encode($db->getLastError());
        return;
    }

    echo json_encode($results);

}

function deleteNoticia($noticia_id)
{

    $db = new MysqliDb();

    $db->where("noticia_id", $noticia_id);
    $results = $db->delete('noticias');

    $db->where("noticia_id", $noticia_id);
    $results = $db->delete('noticias_fotos');

    $db->where("noticia_id", $noticia_id);
    $results = $db->delete('noticias_comentarios');

    echo json_encode(1);
}


function updateNoticia($noticia)
{
    $db = new MysqliDb();

    $decoded = json_decode($noticia);

    $db->where("noticia_id", $decoded->noticia_id);

    $data = array("titulo" => $decoded->titulo,
        "subtitulo" => $decoded->subtitulo,
        "link" => $decoded->link,
        "detalles" => $decoded->detalles,
        "creador_id" => $decoded->creador_id,
        "vistas" => 0,
        "tipo" => $decoded->tipo,
        "fecha" => substr($decoded->fecha, 0, 10));

    $results = $db->update('noticias', $data);

    if (!$results) {
        echo json_encode($db->getLastError());
        return;
    }

    $db->where("noticia_id", $decoded->noticia_id);
    $results = $db->delete('noticias_fotos');

    $db->where("noticia_id", $decoded->noticia_id);
    $results = $db->delete('noticias_comentarios');


    $db = new MysqliDb();
    foreach ($decoded->fotos as $row) {
        $data = array("noticia_id" => $decoded->noticia_id,
            "foto" => $row->foto,
            "main" => $row->main);

        $results = $db->insert('noticias_fotos', $data);

        if ($results < 0) {
            echo json_encode($db->getLastError());
            return;
        }
    }

    foreach ($decoded->comentarios as $row) {
        $data = array("noticia_id" => $decoded->noticia_id,
            "titulo" => $row->titulo,
            "detalles" => $row->detalles,
            "parent_id" => $row->parent_id,
            "votos_up" => $row->votos_up,
            "votos_down" => $row->votos_down,
            "fecha" => $decoded->fecha);

        $results = $db->insert('noticias_comentarios', $data);

        if ($results < 0) {
            echo json_encode($db->getLastError());
            return;
        }
    }

    echo json_encode(1);
}


function saveNoticia($noticia)
{
    $db = new MysqliDb();

    $decoded = json_decode($noticia);

    $data = array("titulo" => $decoded->titulo,
        "subtitulo" => $decoded->subtitulo,
        "link" => $decoded->link,
        "detalles" => $decoded->detalles,
        "creador_id" => $decoded->creador_id,
        "vistas" => 0,
        "tipo" => $decoded->tipo,
        "fecha" => $decoded->fecha);

    $results = $db->insert('noticias', $data);

    if ($results < 0) {
        echo json_encode($db->getLastError());
        return;
    }

    foreach ($decoded->fotos as $row) {
        $data = array("noticia_id" => $results,
            "foto" => $row->foto,
            "main" => $row->main);

        $results = $db->insert('noticias_fotos', $data);

        if ($results < 0) {
            echo json_encode($db->getLastError());
            return;
        }
    }

    echo json_encode(1);
}


function getNoticias()
{
    $db = new MysqliDb();
    $results = $db->rawQuery('Select noticia_id, titulo, subtitulo, link, detalles, fecha, creador_id, vistas, tipo, 0 fotos, 0 comentarios from noticias order by noticia_id desc;');

    foreach ($results as $key => $row) {
        $db->where('noticia_id', $row["noticia_id"]);
        $fotos = $db->get('noticias_fotos');
        $results[$key]["fotos"] = $fotos;


        $sql_comment = 'SELECT noticia_comentario_id, noticia_id,titulo,detalles,parent_id,creador_id,0 creador,votos_up,votos_down,fecha FROM noticias_comentarios WHERE noticia_id = ' . $row["noticia_id"] . ';';
        $comentarios = $db->rawQuery($sql_comment);

        foreach ($comentarios as $keyComment => $rowComment) {
            $db2 = new MysqliDb();
            $db2->where('cliente_id', $rowComment['creador_id']);
            $cliente = $db2->get('clientes');
            $comentarios[$keyComment]['creador'] = $cliente;
        }
        $results[$key]["comentarios"] = $comentarios;

    }


    echo json_encode($results);
}
