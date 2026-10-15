// Browser-only storage (GitHub Pages has no PHP/MySQL). Data lives in this browser's localStorage.
const DB = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)) || []; } catch(e){ return []; } },
  set(k,v){ localStorage.setItem(k, JSON.stringify(v)); },
  add(k,row){ const a=this.get(k); row.id=(a.reduce((m,r)=>Math.max(m,r.id),0))+1; a.push(row); this.set(k,a); return row; }
};
function showModal(type,title,msg){
  const c={success:['#4CAF50','fa-check-circle text-success'],error:['#f44336','fa-times-circle text-danger'],warning:['#ff9800','fa-exclamation-triangle text-warning']}[type];
  document.getElementById('responseModalLabel').textContent=title;
  document.getElementById('modalMessage').textContent=msg;
  const h=document.getElementById('modalHeader'); h.style.backgroundColor=c[0]; h.style.color='white';
  const i=document.getElementById('modalIcon'); i.className='fa '+c[1]+' fa-4x'; if(i.className.indexOf('fas')<0) i.className='fas '+c[1]+' fa-4x';
  const el=document.getElementById('responseModal');
  if(window.jQuery && jQuery.fn.modal) jQuery(el).modal('show'); else new bootstrap.Modal(el).show();
}
function initRegister(){
  document.getElementById('regForm').addEventListener('submit',e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(e.target)); d.age=parseInt(d.age)||0;
    const list=DB.get('alumni');
    if(list.some(r=>r.fullName===d.fullName&&r.dateOfBirth===d.dateOfBirth))
      return showModal('warning','Duplicate Record','A record with this name and date of birth already exists. If you need to update your information, please contact the administrator.');
    d.registrationDate=new Date().toISOString(); DB.add('alumni',d); e.target.reset();
    showModal('success','Registration Successful','Thank you for registering! Your information has been successfully saved.');
  });
}
function initContact(){
  document.getElementById('contactForm').addEventListener('submit',e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(e.target)); d.status='unread'; d.submission_date=new Date().toISOString();
    DB.add('contact_messages',d); e.target.reset();
    showModal('success','Success','Your message has been sent. Thank you!');
  });
}
