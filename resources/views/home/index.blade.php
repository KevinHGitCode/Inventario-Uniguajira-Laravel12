@extends('layouts.app')

@section('title', 'Inicio')

@section('content')
    <h1>Bienvenido {{ Auth::user()->name }}</h1>
    <p>Panel de control del sistema de inventario.</p>
@endsection
