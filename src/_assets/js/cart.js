document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge()

    const addToCartButtons = document.querySelectorAll('.add-to-cart')
    const cart = storage.getCart()

    // Marquer les produits déjà présents dans le panier
    addToCartButtons.forEach((button) => {
        const productElement = button.closest('.product-infos')
        const productId = productElement.dataset.id

        // Vérifier si le produit est déjà dans le panier
        const isProductInCart = cart.some((item) => item.id === productId)

        if (isProductInCart) {
            // Si le produit est déjà dans le panier, ajouter la classe "buyed" au bouton
            button.classList.add('buyed')
            button.textContent = 'Déjà ajouté' // Modifier le texte du bouton pour plus de clarté
        } else {
            // Ajouter un écouteur d'événements si le produit n'est pas dans le panier
            button.addEventListener('click', function (event) {
                event.preventDefault() // Empêche le comportement par défaut du lien

                // Récupérer les données du produit à partir des attributs data-*
                const product = {
                    id: productElement.dataset.id,
                    title: productElement.dataset.title,
                    price: productElement.dataset.price,
                    image: productElement.image,
                    link: productElement.dataset.link,
                    qty: 1
                }

                // Ajouter le produit au panier
                addToCart(product)
                // Ajouter la classe "buyed" après avoir ajouté le produit au panier
                button.classList.add('buyed')
            })
        }
    })

    // Fonction pour ajouter un produit au panier
    function addToCart(product) {
        // Mettre à jour le panier dans Local Storage
        cart.push(product)
        storage.setCart(cart)
    }
})
