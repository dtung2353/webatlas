FROM camptocamp/mapserver:7.6

# Copy mapfile configuration directly into container
COPY mapserver/config/atlas.map /etc/mapserver/atlas.map

# Copy all GIS data files (.gpkg, .shp, .geojson) directly into container
COPY mapserver/Du_An_WebAtlas_Nhom /data
