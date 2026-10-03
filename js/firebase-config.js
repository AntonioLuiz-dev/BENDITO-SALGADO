// Configuracao do Firebase - Substitua pelos seus dados
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Referencias dos servicos
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Colecoes do Firestore
const COLLECTIONS = {
  PRODUCTS: 'produtos',
  CATEGORIES: 'categorias',
  ORDERS: 'pedidos',
  SETTINGS: 'configuracoes'
};

// Funcao para inicializar dados padrao se nao existirem
async function initializeDefaultData() {
  try {
    // Verifica se ja existem categorias
    const categoriesSnap = await db.collection(COLLECTIONS.CATEGORIES).get();
    
    if (categoriesSnap.empty) {
      // Cria categorias padrao
      const defaultCategories = [
        { id: 'congelados', nome: 'Salgados Congelados', icone: '🧊', ordem: 1, ativo: true },
        { id: 'assados', nome: 'Salgados Assados', icone: '🔥', ordem: 2, ativo: true }
      ];
      
      for (const cat of defaultCategories) {
        await db.collection(COLLECTIONS.CATEGORIES).doc(cat.id).set(cat);
      }
      
      // Cria produtos padrao
      const defaultProducts = [
        // Congelados
        { nome: 'Coxinha', descricao: 'Cento de coxinha congelada, pronta para fritar.', preco: 35, categoria: 'congelados', imagem: '', icone: '🐔', ativo: true, destaque: false },
        { nome: 'Medalhao de Calabresa', descricao: 'Cento de medalhao de calabresa congelado.', preco: 35, categoria: 'congelados', imagem: '', icone: '🥓', ativo: true, destaque: false },
        { nome: 'Kibe', descricao: 'Cento de kibe congelado, pronto para fritar.', preco: 35, categoria: 'congelados', imagem: '', icone: '🥙', ativo: true, destaque: false },
        { nome: 'Napolitano', descricao: 'Cento de napolitano congelado.', preco: 35, categoria: 'congelados', imagem: '', icone: '🍕', ativo: true, destaque: false },
        { nome: 'Salsicha', descricao: 'Cento de enroladinho de salsicha congelado.', preco: 35, categoria: 'congelados', imagem: '', icone: '🌭', ativo: true, destaque: false },
        { nome: 'Mini Pastel', descricao: 'Cento de mini pastel congelado.', preco: 50, categoria: 'congelados', imagem: '', icone: '🥟', ativo: true, destaque: false },
        { nome: 'Camarao Empanado', descricao: 'Camarao empanado congelado. Preco por unidade.', preco: 2, categoria: 'congelados', imagem: '', icone: '🦐', ativo: true, destaque: false },
        // Assados
        { nome: 'Hamburguinho com Cheddar', descricao: 'Cento de hamburguinho assado com cheddar.', preco: 90, categoria: 'assados', imagem: '', icone: '🍔', ativo: true, destaque: false },
        { nome: 'Hamburguinho com Requeijao', descricao: 'Cento de hamburguinho assado com requeijao cremoso.', preco: 90, categoria: 'assados', imagem: '', icone: '🍔', ativo: true, destaque: false },
        { nome: 'Mini Pizza', descricao: 'Cento de mini pizza assada.', preco: 80, categoria: 'assados', imagem: '', icone: '🍕', ativo: true, destaque: false },
        { nome: 'Empada de Queijo / Frango', descricao: 'Cento de empada assada de queijo ou frango.', preco: 80, categoria: 'assados', imagem: '', icone: '🥧', ativo: true, destaque: false },
        { nome: 'Doguinho', descricao: 'Cento de doguinho assado.', preco: 80, categoria: 'assados', imagem: '', icone: '🌭', ativo: true, destaque: false },
        { nome: 'Joelinho', descricao: 'Cento de joelinho assado.', preco: 80, categoria: 'assados', imagem: '', icone: '🥐', ativo: true, destaque: false },
        { nome: 'Esfiha Carne / Queijo', descricao: 'Cento de esfiha assada de carne ou queijo.', preco: 80, categoria: 'assados', imagem: '', icone: '🥟', ativo: true, destaque: false },
        { nome: 'Bandeja com 20 Salgados Assados', descricao: 'Bandeja sortida com 20 salgados assados.', preco: 22, categoria: 'assados', imagem: '', icone: '🍱', ativo: true, destaque: true },
        { nome: 'Sanduiche de Frango Cremoso', descricao: 'Cento de sanduiche de frango cremoso assado.', preco: 80, categoria: 'assados', imagem: '', icone: '🥪', ativo: true, destaque: false }
      ];
      
      for (const prod of defaultProducts) {
        await db.collection(COLLECTIONS.PRODUCTS).add({
          ...prod,
          criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    }
    
    // Verifica se existem configuracoes
    const settingsDoc = await db.collection(COLLECTIONS.SETTINGS).doc('loja').get();
    
    if (!settingsDoc.exists) {
      await db.collection(COLLECTIONS.SETTINGS).doc('loja').set({
        nomeLoja: 'Delcias da Mira Oliveira',
        telefone: '(21) 96477-0258',
        whatsapp: '5521964770258',
        endereco: '',
        deliveryAtivo: true,
        retiradaAtiva: true,
        taxaDelivery: 5,
        pedidoMinimo: 20,
        horarios: {
          segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
          terca: { aberto: true, inicio: '08:00', fim: '18:00' },
          quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
          quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
          sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
          sabado: { aberto: true, inicio: '08:00', fim: '14:00' },
          domingo: { aberto: false, inicio: '', fim: '' }
        },
        corPrimaria: '#8B4513',
        corSecundaria: '#D2691E'
      });
    }
    
    console.log('Dados iniciais verificados/criados com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
  }
}
