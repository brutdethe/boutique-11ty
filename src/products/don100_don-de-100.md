---
layout: _layouts/product_card.njk
id: don100
name:
    fr: don de 100 €
    en: 100 € Donation
mini_descr:
    fr: Soutenez-nous avec un don de 100 €
    en: Support us with a 100 €
tags: ['produit', 'dons']
description: 
    fr: >
        Faire un don de 100 € et recevoir un kit de dégustation.
    en: >
        Make a 100 € donation and receive a tasting kit.
photos:
    - ticket-gongfucha.jpg
price: 100.00
stock: 30
shipping_type: sans_envoi
eleventyComputed:
    title: '{{ tags }} - {{ name[page.lang] }}'
---
