## Crear enlace simbólico a `seeders` (rutas relativas)

### 🪟 Windows (PowerShell)

```powershell
# Ir al proyecto
cd .\Inventario-Uniguajira-Laravel12

# Eliminar enlace/carpeta previa si existe
Remove-Item -Recurse -Force "storage/app/public/seeders" -ErrorAction SilentlyContinue

# Crear enlace simbólico (ruta relativa)
New-Item -ItemType SymbolicLink `
  -Path "storage/app/public/seeders" `
  -Target "storage/app/seeders"
```

### 🐧 Linux / Mac (bash)
```bash
# Ir al proyecto
cd ./Inventario-Uniguajira-Laravel12

# Eliminar enlace/carpeta previa si existe
rm -rf storage/app/public/seeders

# Crear enlace simbólico (ruta relativa)
ln -s ../../seeders storage/app/public/seeders
```
