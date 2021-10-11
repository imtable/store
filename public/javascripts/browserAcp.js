console.log('start');

const USER = { name: '' }

const getInitData = async () => {
   const { data } = await axios.get('/acp/getInitData');
   return data;
}

const ITEM = {
   id: null,
   categories: '',
}

const render = (data) => {
   const renderItemCategories = () => {
      const selectCategoriesEl = document.querySelector('.selectItemCategories');
      let html = '<option disabled>select categories: ctrl + click</option>';
      for (let item of data.categories) {
         html += `<option value="${item._id}">${item.name}</option>`;
      }
      selectCategoriesEl.innerHTML = html;
   }
   const renderItemSpec = () => {
      const addSpecEl = document.querySelectorAll('.btn-spec-add');
      addSpecEl.forEach((el) => {
         el.addEventListener('click', (ev) => {
            if (ev.target.classList.contains("formItemVersion_btn-spec-add")) {
               const inpSpecNameEl = document.querySelector('.formItemVersion_outer .inpItemSpecName').value;
               const specWrapperEl = document.querySelector('.formItemVersion_outer .formItem_spec-inner');
               const html = `
               <input class="inpItemSpecUnit" type="text" name="spec_${inpSpecNameEl}" placeholder="${inpSpecNameEl} of item">`;
               specWrapperEl.insertAdjacentHTML('beforeend', html);
            } else {
               const inpSpecNameEl = document.querySelector('.formItem_outer .inpItemSpecName').value;
               const specWrapperEl = document.querySelector('.formItem_outer .formItem_spec-inner');
               const html = `
               <input class="inpItemSpecUnit" type="text" name="spec_${inpSpecNameEl}" placeholder="${inpSpecNameEl} of item">`;
               specWrapperEl.insertAdjacentHTML('beforeend', html);
            }
         });
      });
   }

   const toggleItemVersion = () => {
      const addVersionEl = document.querySelector('.formItem_version-add');
      addVersionEl.addEventListener('click', (ev) => {
         const itemVersionOuterEl = document.querySelector('.formItemVersion_outer');
         itemVersionOuterEl.classList.toggle('show');
      });
   }
   renderItemCategories();
   renderItemSpec();
   toggleItemVersion();
}
const renderItemVersionCategories = () => {
   const formItemVersionSelectEl = document.querySelector('.formItemVersion .selectItemCategories');
   formItemVersionSelectEl.innerHTML = '';
   let html = '';
   for (let item of ITEM.categories) {
      html += `<option selected value="${item}"></option>`;
   }
   formItemVersionSelectEl.insertAdjacentHTML('beforeend', html);
}

const postItem = () => {
   const form = document.forms.formItem;
   form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const formData = new FormData(ev.target);
      const { data } = await axios.post('/acp/postItem', formData);
      console.log(data.status);

      const itemCategoriesEl = document.querySelectorAll('.selectItemCategories :checked');
      const itemCategories = [...itemCategoriesEl].map(option => option.value);
      ITEM.categories = itemCategories;
      ITEM.id = data.payload.itemId;
      renderItemVersionCategories();
   });
}

const postCat = () => {
   const form = document.forms.formCategorie;
   form.addEventListener('submit', async (ev) => {
      console.log('data');
      ev.preventDefault();
      const formData = new FormData(ev.target);
      const { data } = await axios.post('/acp/postCat', formData);
      console.log(data);
   });
}

const postItemVersion = () => {
   const form = document.forms.formItemVersion;
   form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const formData = new FormData(ev.target);
      formData.append('itemId', ITEM.id);
      const { data } = await axios.post('/acp/postItemVersion', formData);
      console.log(data.status);
   });
}

const authModule = () => {
   const userIdentify = async () => {
      const { data } = await axios.get('/userIdentify');
      if (data.status.includes('error')) {
         console.log('user is not identify')
         return;
      }
   
      USER.name = data.payload.profile.name;
      if (USER.name) {
         console.log('welcome back', USER.name);
         const signingEl = document.querySelector('.signing').classList.add('hide');
         const logoutEl = document.querySelector('.logout').classList.add('show');

      }
   }
   
   const userReg = async () => {
      const form = document.forms.userFormReg;
      form.addEventListener('submit', async (ev) => {
         ev.preventDefault();
         const formData = new FormData(ev.target);
   
         const { data } = await axios.post('/userReg', formData);
         if (data.status.includes('success')) {
            console.log(data.status);
            userIdentify();
         }
         console.log(data.status);
      });
   }
   
   const userLogin = async () => {
      const form = document.forms.userFormLogin;
      form.addEventListener('submit', async (ev) => {
         ev.preventDefault();
         const formData = new FormData(ev.target);
         const { data } = await axios.post('/userLogin', formData);
         if (data.status.includes('success')) {
            console.log(`${data.status}`);
            USER.name = data.payload.profile.name;
            window.location.reload();
            return;
         }
         console.log(data.status);
         renderError(data.status);
      });
   }
   
   const userLogout = async () => {
      const btnLogoutEl = document.querySelector('.logout_btn-logout');
      btnLogoutEl.addEventListener('click', async (ev) => {
         const { data } = await axios.get('/userLogout');
         if (data.status.includes('success')) {
            console.log(`${USER.name} logout success`);
            USER.name = '';
            window.location.reload();
         }
      });
   }
   
   function fadeRemove(elem, t, f){
     // кадров в секунду (по умолчанию 50)
     var fps = f || 50; 
     // время работы анимации (по умолчанию 500мс)
     var time = t || 500; 
     // сколько всего покажем кадров
     var steps = time / (1000 / fps);   
     // текущее значение opacity - изначально 0
     var op = 1;
     // изменение прозрачности за 1 кадр
     var d0 = op / steps;
     
     // устанавливаем интервал (1000 / fps) 
     // например, 50fps -> 1000 / 50 = 20мс  
     var timer = setInterval(function(){
       // уменьшаем текущее значение opacity
       op -= d0;
       // устанавливаем opacity элементу DOM
       elem.style.opacity = op;
       // уменьшаем количество оставшихся шагов анимации
       steps--;
       
       // если анимация окончена
       if(steps <= 0){
         // убираем интервал выполнения
         clearInterval(timer);
         // и убираем элемент из потока документа
         elem.remove();
         // elem.style.display = 'none';
       }
     }, (1000 / fps));
   }
   
   const renderError = (status) => {
      const errorEl = document.querySelectorAll('.error');
      if (errorEl) {
         errorEl.forEach(element => {
            fadeRemove(element, 444, 60);
         });
      }
      const showedUserFormEl = document.querySelector('.userForm_outer.show .error-outer');
      const html =   `<div class="error">
                        <span class="error-text">${status}</span>
                     </div>`;
      showedUserFormEl.insertAdjacentHTML('beforeend', html);
   }
   
   const renderSigning = () => {
      const renderLogin = () => {
         const btnSigningEl = document.querySelector('.signing_btn-login');
         btnSigningEl.addEventListener('click', (ev) => {
            const showing = document.querySelector('.userFormLogin_outer').classList.add('show');
            const unshowing = document.querySelector('.userFormReg_outer').classList.remove('show');
         });
      }
      const renderReg = () => {
         const btnSigningEl = document.querySelector('.signing_btn-reg');
         btnSigningEl.addEventListener('click', (ev) => {
            const showing = document.querySelector('.userFormReg_outer').classList.add('show');
            const unshowing = document.querySelector('.userFormLogin_outer').classList.remove('show');
         });
      }
      renderLogin();
      renderReg();
   }
   userIdentify();
   userReg();
   userLogin();
   userLogout();
   renderSigning();
}

const init = async () => {
   const data = await getInitData();
   render(data);
   authModule();
   postItem();
   postItemVersion();
   postCat();
}
init();
