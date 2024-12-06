---
layout: _layouts/product_card.njk
id: Don100
name: Don de 100 €
tags: ['produit', 'dons']

description: >
    Faire un don de 100 € et recevoir un kit de dégustation et l'affiche du festival.
photos:
    - ticket-gongfucha.jpg
price: 100.00
stock: 30
shipping_type: sans_envoi
eleventyComputed:
    title: '{{ tags }} - {{ name }}'
---
