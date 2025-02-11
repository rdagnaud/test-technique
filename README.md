# Test technique L'addition

Setup initial:

```
npm install
```

Pour créer la base de données (Par défaut, la db sera créée dans le dossier ``database`` sous le nom ``database_technical_test.sqlite``; cela peut-etre changé dans le fichier ``config.ts`` (``DATABASE_PATH``)):

```
npm run initdb 
```

Pour lancer le serveur (Par défaut, le serveur sera lancé sur le port 3000; cela peut aussi etre changé dans le fichier ``config.ts`` (``API_PORT``)):

```
npm run dev
```

Pour générer un rapport de la base de données (Nombre d'utilisateurs, et nombre de produits pour chaque utilisateur):

```
npm run generatereport
```

Pour appeler une route de l'API:

```
curl http://localhost:[API_PORT]/...
```

Pour les endpoints necessitant une authentification (préfixés dans la liste ci-dessous par [AUTH]), un header contenant ``Authorization: Bearer [JWT]`` avec le JWT récupéré a la connection est nécessaire

Liste des endpoints de l'API:

Users:

``[POST] /users/`` : creer un utilisateur; s'attend a recevoir un body contenant ``username`` et ``password``, renvoie l'utilisateur si celui-ci a bien été créé (a l'exception du mot de passe)

``[POST] /users/auth`` : se connecter; s'attend a recevoir un body contenant ``username`` et ``password``, renvoie le ``JWT`` si la connection s'est bien effectuée

[AUTH] ``[DELETE] /users/:id`` : supprimer un utilisateur, s'attend a recevoir un ``id`` en parametre, necessite une authentification de l'utilisateur correspondant.

Products:

[AUTH] ``[POST] /products/`` : créer un produit, s'attend a recevoir un body contenant ``name``, et optionnellement ``description``, renvoie le produit s'il a été créé

``[GET] /products/`` : indexer les produits, pas de parametre, renvoie la liste de tous les produits

``[GET] /products/:id`` : recuperer un produit, s'attend a recevoir un ``id`` de produit en parametre, renvoie le produit s'il existe

[AUTH] ``[POST] /products/:id`` : modifier un produit, s'attend a recevoir un body contenant ``name`` et ``description`` (tous les deux optionnels), renvoie le produit apres modification (ou tel qu'il était si rien n'avait a etre modifié), necessite une authentification de l'utilisateur correspondant au produit.

[AUTH] ``[DELETE] /products/:id`` : supprimer un produit, s'attend a recevoir un ``id`` en parametre, necessite une authentification de l'utilisateur correspondant au produit.


Exemple de scenario:

```
curl http://localhost:3000/users/ -Method 'POST' -Body @{username = 'username'; password = 'testpassword'} (pour creer un utilisateur)
curl http://localhost:3000/users/auth -Method 'POST' -Body @{username = 'username'; password = 'testpassword'} (pour s'authentifier)
--- récupérer le JWT dans la reponse ---
curl http://localhost:3000/products/ -Method 'POST' -Body @{name = 'assiette'; description = 'Une bien belle assiette'} -Headers @{Authorization = "Bearer exempleDeJwt"} (créer un produit)
--- récupérer l'id de l'objet dans la réponse ---
curl http://localhost:3000/products/[id] -Method 'POST' -Body @{description = 'Une assiette pas si belle'} -Headers @{Authorization = "Bearer exempleDeJwt"} (modifier le produit)
```