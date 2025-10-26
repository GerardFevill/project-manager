---
description: "Commit et push les modifications vers GitHub"
---

Demande à l'utilisateur s'il veut faire un commit et push des modifications.

Si l'utilisateur dit oui:
1. Exécute `git status` pour voir les fichiers modifiés
2. Exécute `git diff` pour voir les changements
3. Ajoute tous les fichiers avec `git add .`
4. Crée un commit avec un message descriptif des changements
5. Push vers GitHub avec `git push`

Si l'utilisateur dit non, ne fais rien.

Note: Ne jamais inclure les lignes "🤖 Generated with Claude Code" ou "Co-Authored-By: Claude" dans les messages de commit.
