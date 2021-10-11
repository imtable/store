console.log('start');

const getInitData = async () => {
   const { data } = await axios.get('/getInitData');
   return data;
}

const USER = { name: '' }

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

const ctrls = () => {
   const getItemsByCat = async () => {
      const categoriesEl = document.querySelectorAll('.header_menu .dropdown-content .dropdown-item');
      categoriesEl.forEach(el => {
         el.addEventListener('click', async (ev) => {
            const { data } = await axios.post('/getItemsByCat', { catID: ev.target.dataset.id });
            console.log(data)
            if ( !(data.status.includes('success')) ) {
               console.log(data.status);
               return;
            }
            render.renderItems(data.payload);
         });
      });
   }
   getItemsByCat();
}

const render = {
   renderCategories: function(data) {
      const catDropdownEl = document.querySelector('.header .header_menu .dropdown .dropdown-content');
      let html = '';
      for (let item of data.categories) {
         html += `<a class='dropdown-item dropdown-item_${item.name}' data-id='${item._id}' href="#">${item.name}</a>`;
      }
      catDropdownEl.innerHTML = html;
   },
   renderItems: function(data) {
      const itemsOuterEl = document.querySelector('.goods .goods_inner');
      console.log(data.items)
      let html = '';
      for (let item of data.items) {
         html += `
            <div class="good">
               <a href="/items/${item._id}" class="good_pic">
                  <img src="${item.picture}" alt="good_pic">
               </a>
               <div class="good_title">
                  <a href="/items/${item._id}">${item.name}</a>
               </div>
               <div class="good_btn-outer">
                  <a class="good_btn-buy btn" href="/items/${item._id}">buy</a>
               </div>
            </div>
         `;
      }
      itemsOuterEl.innerHTML = html;
   },
   run: (data) => {
      render.renderItems(data), render.renderCategories(data)
   }
}
// const render = (data) => {
//    renderCategories(data);
//    renderItems(data);
// }

const init = async () => {
   const data = await getInitData();
   // render.renderItems(data), render.renderCategories(data);
   render.run(data);
   authModule();
   ctrls();
}
init();
