#!/bin/bash

echo "=========================================="
echo "ANALYSE DU SCHEMA DE BASE DE DONNEES"
echo "=========================================="
echo ""

# Compter les fichiers de migration
echo "1. FICHIERS DE MIGRATION"
echo "------------------------"
migration_count=$(find database/migrations -name "*.yaml" -type f | wc -l)
echo "Nombre de fichiers de migration: $migration_count"
echo ""

# Extraire tous les noms de tables (seulement createTable, pas les index)
echo "2. EXTRACTION DES NOMS DE TABLES"
echo "---------------------------------"
echo "Extraction en cours..."

# Créer un fichier temporaire avec tous les noms de tables (seulement createTable)
grep -B5 "tableName:" database/migrations/*.yaml | \
  grep -A5 "createTable:" | \
  grep "tableName:" | \
  sed 's/.*tableName: *//' | \
  sed 's/ *$//' | \
  sort > /tmp/all_tables.txt

total_tables=$(cat /tmp/all_tables.txt | wc -l)
unique_tables=$(cat /tmp/all_tables.txt | sort -u | wc -l)

echo "Total de tables créées: $total_tables"
echo "Tables uniques: $unique_tables"
echo ""

# Vérifier les doublons
echo "3. VERIFICATION DES DOUBLONS"
echo "-----------------------------"
duplicates=$(cat /tmp/all_tables.txt | sort | uniq -d)

if [ -z "$duplicates" ]; then
    echo "✅ Aucun doublon détecté!"
else
    echo "❌ DOUBLONS DETECTES:"
    echo "$duplicates"
fi
echo ""

# Analyser par préfixe
echo "4. ANALYSE PAR PREFIXE"
echo "----------------------"
echo "Tables AO_ (Active Objects - Plugins):"
grep "^ao_" /tmp/all_tables.txt | wc -l

echo "Tables CWD_ (Crowd):"
grep "^cwd_" /tmp/all_tables.txt | wc -l

echo "Tables sans préfixe (Core Jira):"
grep -v "^ao_\|^cwd_" /tmp/all_tables.txt | wc -l
echo ""

# Vérifier les foreign keys
echo "5. FOREIGN KEYS"
echo "---------------"
fk_count=$(grep -h "foreignKeyName:" database/migrations/*.yaml | wc -l)
echo "Nombre de foreign keys définies: $fk_count"
echo ""

# Vérifier les index
echo "6. INDEX"
echo "--------"
index_count=$(grep -h "indexName:" database/migrations/*.yaml | wc -l)
echo "Nombre d'index créés: $index_count"
echo ""

# Répartition par migration
echo "7. REPARTITION PAR FICHIER DE MIGRATION"
echo "----------------------------------------"
for file in database/migrations/*.yaml; do
    filename=$(basename "$file")
    count=$(grep "tableName:" "$file" | wc -l)
    printf "%-45s : %3d tables\n" "$filename" "$count"
done
echo ""

# Sauvegarder la liste complète
echo "8. LISTE COMPLETE DES TABLES"
echo "-----------------------------"
cat /tmp/all_tables.txt | sort -u > database/TABLES-LIST.txt
echo "Liste sauvegardée dans: database/TABLES-LIST.txt"
echo "Total: $(cat database/TABLES-LIST.txt | wc -l) tables uniques"
echo ""

# Vérifier les références potentiellement cassées
echo "9. VERIFICATION DES REFERENCES"
echo "-------------------------------"
echo "Recherche de références à des tables qui n'existent pas..."

# Extraire les références dans les FK
grep -h "references:" database/migrations/*.yaml | \
  sed 's/.*references: *//' | \
  sed 's/(.*$//' | \
  sed 's/ *$//' | \
  sort -u > /tmp/referenced_tables.txt

# Comparer avec les tables créées
echo "Tables référencées dans les FK:"
ref_count=$(cat /tmp/referenced_tables.txt | wc -l)
echo "  $ref_count tables référencées"

# Vérifier si toutes existent
missing_refs=""
while IFS= read -r table; do
    if ! grep -q "^$table$" /tmp/all_tables.txt; then
        missing_refs="$missing_refs\n  - $table"
    fi
done < /tmp/referenced_tables.txt

if [ -z "$missing_refs" ]; then
    echo "✅ Toutes les tables référencées existent!"
else
    echo "⚠️  ATTENTION - Tables référencées mais non créées:"
    echo -e "$missing_refs"
fi
echo ""

echo "=========================================="
echo "FIN DE L'ANALYSE"
echo "=========================================="

# Cleanup
rm -f /tmp/all_tables.txt /tmp/referenced_tables.txt
