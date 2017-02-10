# Image Docker permettant de produire le livrable BB-8

⚠ WIP : ne fonctionne pas, on obtient l'erreur suivante lors du `npm run build`:

    ERROR in Path must be a string. Received undefined



## Construire l'image docker `bb8-builder`

    git clone https://git.test.services.local/dt_ct_ioda/BB-8.git
    cd BB-8
    git checkout <tag_a_livrer>
    cp package.json docker-builder
    docker build --build-arg http_proxy=http://proxytest.services.local:3128 -t bb8-builder docker-builder

## Générer le livrable à l'aide de l'image docker `bb8-builder`

    git clone https://git.test.services.local/dt_ct_ioda/BB-8.git
    cd BB-8
    git checkout <tag_a_livrer>
    docker run --rm -it -e http_proxy=http://proxytest.services.local:3128 -v $(pwd):/app bb8-builder
    # Récupérer le .tgz dans le répertoire courant
