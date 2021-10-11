console.log('start');

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

const init = async () => {
   const data = await getInitData();
   render(data);
   postItem();
   postItemVersion();
}
init();
