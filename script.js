$(document).ready(function() {
    // Dados do cardápio
    const menuItems = [
        {
            id: 1,
            name: "Bruschetta Clássica",
            description: "Pão italiano grelhado com tomate fresco, manjericão e azeite de oliva",
            price: 18.90,
            category: "entradas",
            image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            id: 2,
            name: "Carpaccio de Filé",
            description: "Finas fatias de filé cru temperadas com azeite, limão e rúcula",
            price: 32.50,
            category: "entradas",
            image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            id: 3,
            name: "Filé Mignon ao Molho Madeira",
            description: "Filé mignon suculento com molho de vinho madeira e acompanhamentos",
            price: 68.90,
            category: "principais",
            image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            id: 4,
            name: "Risoto de Cogumelos",
            description: "Risoto cremoso com cogumelos frescos e finalizado com trufas",
            price: 45.50,
            category: "principais",
            image: "https://images.unsplash.com/photo-1633945274309-2c16c9682a8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            id: 5,
            name: "Tiramisu Clássico",
            description: "Sobremesa italiana com camadas de biscoito champanhe, café e creme de mascarpone",
            price: 22.90,
            category: "sobremesas",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            id: 6,
            name: "Brownie com Sorvete",
            description: "Brownie quente de chocolate com sorvete de baunilha e calda de caramelo",
            price: 19.50,
            category: "sobremesas",
            image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            id: 7,
            name: "Vinho Tinto Casa Perini",
            description: "Vinho tinto seco da serra gaúcha, safra 2020, taça 300ml",
            price: 25.00,
            category: "bebidas",
            image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            id: 8,
            name: "Suco Natural de Laranja",
            description: "Suco fresco de laranja espremido na hora, copo 500ml",
            price: 12.00,
            category: "bebidas",
            image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        }
    ];

    // Carrinho de compras
    let cart = [];
    let user = null;

    // Carrega os itens do menu
    function loadMenuItems(category = 'todos') {
        $('.menu-items').empty();
        
        const filteredItems = category === 'todos' 
            ? menuItems 
            : menuItems.filter(item => item.category === category);
        
        filteredItems.forEach(item => {
            $('.menu-items').append(`
                <div class="menu-item" data-category="${item.category}">
                    <div class="menu-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="menu-item-info">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="menu-item-price">
                            <span class="price">R$ ${item.price.toFixed(2)}</span>
                            <button class="add-to-cart" data-id="${item.id}">Adicionar</button>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Atualiza o contador do carrinho
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        $('#cart-count').text(totalItems);
    }

    // Atualiza o modal do carrinho
    function updateCartModal() {
        const $cartItems = $('#cart-items');
        $cartItems.empty();
        
        if (cart.length === 0) {
            $cartItems.append('<p class="empty-cart">Seu carrinho está vazio</p>');
            $('#checkout-btn').prop('disabled', true);
        } else {
            cart.forEach(item => {
                const menuItem = menuItems.find(mi => mi.id === item.id);
                $cartItems.append(`
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${menuItem.name}</div>
                            <div class="cart-item-price">R$ ${menuItem.price.toFixed(2)}</div>
                        </div>
                        <div class="cart-item-actions">
                            <input type="number" min="1" value="${item.quantity}" class="cart-item-quantity">
                            <button class="remove-item">&times;</button>
                        </div>
                    </div>
                `);
            });
            
            $('#checkout-btn').prop('disabled', false);
        }
        
        updateCartTotal();
    }

    // Atualiza o total do carrinho
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => {
            const menuItem = menuItems.find(mi => mi.id === item.id);
            return sum + (menuItem.price * item.quantity);
        }, 0);
        
        $('#cart-total').text(`R$ ${total.toFixed(2)}`);
    }

    // Atualiza o resumo do pedido no checkout
    function updateOrderSummary() {
        const $orderItems = $('#order-items');
        $orderItems.empty();
        
        cart.forEach(item => {
            const menuItem = menuItems.find(mi => mi.id === item.id);
            $orderItems.append(`
                <div class="order-item">
                    <span>${menuItem.name} x ${item.quantity}</span>
                    <span>R$ ${(menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
            `);
        });
        
        const total = cart.reduce((sum, item) => {
            const menuItem = menuItems.find(mi => mi.id === item.id);
            return sum + (menuItem.price * item.quantity);
        }, 0);
        
        $('#order-total').text(`R$ ${total.toFixed(2)}`);
    }

    // Abre o modal
    function openModal(modalId) {
        $(modalId).fadeIn();
        $('body').css('overflow', 'hidden');
    }

    // Fecha o modal
    function closeModal() {
        $('.modal').fadeOut();
        $('body').css('overflow', 'auto');
    }

    // Filtra itens por categoria
    $('.category-btn').on('click', function() {
        $('.category-btn').removeClass('active');
        $(this).addClass('active');
        const category = $(this).data('category');
        loadMenuItems(category);
    });

    // Adiciona item ao carrinho
    $(document).on('click', '.add-to-cart', function() {
        const itemId = parseInt($(this).data('id'));
        const existingItem = cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: itemId, quantity: 1 });
        }
        
        updateCartCount();
        showNotification('Item adicionado ao carrinho!');
    });

    // Remove item do carrinho
    $(document).on('click', '.remove-item', function() {
        const itemId = parseInt($(this).closest('.cart-item').data('id'));
        cart = cart.filter(item => item.id !== itemId);
        updateCartModal();
        updateCartCount();
        showNotification('Item removido do carrinho!');
    });

    // Atualiza quantidade no carrinho
    $(document).on('change', '.cart-item-quantity', function() {
        const itemId = parseInt($(this).closest('.cart-item').data('id'));
        const quantity = parseInt($(this).val());
        
        if (quantity < 1) {
            $(this).val(1);
            return;
        }
        
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = quantity;
            updateCartTotal();
        }
    });

    // Mostra notificação
    function showNotification(message) {
        const $notification = $(`
            <div class="notification">
                ${message}
            </div>
        `);
        
        $('body').append($notification);
        $notification.fadeIn().delay(2000).fadeOut(function() {
            $(this).remove();
        });
    }

    // Eventos dos modais
    $('#login-btn').on('click', () => openModal('#login-modal'));
    $('#cart-btn').on('click', () => {
        updateCartModal();
        openModal('#cart-modal');
    });
    $('#checkout-btn').on('click', () => {
        updateOrderSummary();
        openModal('#checkout-modal');
    });
    
    $('#show-signup').on('click', function(e) {
        e.preventDefault();
        closeModal();
        openModal('#signup-modal');
    });
    
    $('#show-login').on('click', function(e) {
        e.preventDefault();
        closeModal();
        openModal('#login-modal');
    });
    
    $('.close-modal').on('click', closeModal);
    
    $(window).on('click', function(e) {
        if ($(e.target).hasClass('modal')) {
            closeModal();
        }
    });

    // Formulário de login
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        
        // Simulação de login
        user = { email, name: email.split('@')[0] };
        showNotification(`Bem-vindo, ${user.name}!`);
        closeModal();
    });

    // Formulário de cadastro
    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        const name = $('#signup-name').val();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        const phone = $('#signup-phone').val();
        
        // Simulação de cadastro
        user = { name, email, phone };
        showNotification(`Cadastro realizado com sucesso, ${name}!`);
        closeModal();
    });

    // Formulário de checkout
    $('#checkout-form').on('submit', function(e) {
        e.preventDefault();
        
        if (!user) {
            showNotification('Por favor, faça login ou cadastre-se antes de finalizar o pedido.');
            openModal('#login-modal');
            return;
        }
        
        const address = $('#delivery-address').val();
        const notes = $('#delivery-notes').val();
        const payment = $('input[name="payment"]:checked').val();
        
        const total = cart.reduce((sum, item) => {
            const menuItem = menuItems.find(mi => mi.id === item.id);
            return sum + (menuItem.price * item.quantity);
        }, 0);
        
        // Monta mensagem para WhatsApp
        let message = `Olá, gostaria de fazer um pedido!\n\n`;
        message += `*Itens do pedido:*\n`;
        
        cart.forEach(item => {
            const menuItem = menuItems.find(mi => mi.id === item.id);
            message += `- ${menuItem.name} x ${item.quantity} - R$ ${(menuItem.price * item.quantity).toFixed(2)}\n`;
        });
        
        message += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
        message += `*Dados de entrega:*\n`;
        message += `Nome: ${user.name}\n`;
        message += `Endereço: ${address}\n`;
        message += `Telefone: ${user.phone || 'Não informado'}\n`;
        message += `Forma de pagamento: ${getPaymentMethodName(payment)}\n`;
        
        if (notes) {
            message += `\n*Observações:*\n${notes}\n`;
        }
        
        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Abre WhatsApp (substitua pelo número real do restaurante)
        window.open(`https://wa.me/5511999999999?text=${encodedMessage}`, '_blank');
        
        // Limpa o carrinho após o pedido
        cart = [];
        updateCartCount();
        closeModal();
        showNotification('Pedido enviado com sucesso! Obrigado!');
    });

    // Retorna o nome do método de pagamento
    function getPaymentMethodName(payment) {
        switch(payment) {
            case 'dinheiro': return 'Dinheiro';
            case 'cartao': return 'Cartão na entrega';
            case 'pix': return 'PIX';
            default: return payment;
        }
    }

    // Inicializa a página
    loadMenuItems();
    updateCartCount();

    // Adiciona estilo para notificação
    $('<style>')
        .text(`
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--primary-color);
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                box-shadow: var(--shadow);
                z-index: 1000;
                display: none;
            }
        `)
        .appendTo('head');
});