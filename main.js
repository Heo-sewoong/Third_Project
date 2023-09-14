let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event)=> getNewsByTopic(event) ));

let url;

let searchButton = document.getElementById("search-button");


// 각 함수에서 필요한 url을 만든다
// api 호출 함수를 부른다

const getNews = async () => {
  try{
 
  let header = new Headers({'x-api-key':'HAb-VwD8jA1lFdszL-lwITEkRTIlYrTwPo-eSBa-IQk'})
    url.searchParams.set('page', page);

  let response = await fetch(url,{headers:header});
  let data = await response.json();
  if(response.status == 200){
    if(data.total_hits == 0){
      throw new Error("검색된 결과값이 없습니다.")
    }

    console.log("받은 데이터가 뭐지?", data)
    news = data.articles;
    total_pages = data.total_pages;
    page = data.page;
    console.log(news);
    render();
    pagenation();
    
  }else{
    throw new Error(data.message)
  }



  }catch(error){
    console.log("잡힌 에러는",error.message)
    errorRender(error.message);

  }

 
  

}

const getLatestNews = async () => {
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`) 

  getNews();
}

const getNewsByTopic = async (event) =>{
  console.log("클릭됨", event.target.textContent);
  let topic = event.target.textContent.toLowerCase()
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&&topic=${topic}`)
  
  getNews();

}

const getNewsByKeyword = async () => {


  let keyword = document.getElementById("search-input").value;
  url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)
 
  getNews();

}



const render = () =>{
  let newsHTML = '';
  newsHTML = news.map((item) => {
    return ` <div class="row news">
    <div class="col-lg-4">
      <img class="news-img-size" src="${item.media}">
    </div>
    <div class="col-lg-8">
      <h2>
        ${item.title}
      </h2>
      <p>
      ${item.summary}
      </p>
      <div>
      ${item.rights} * ${item.published_date}
      </div>
    </div>
  </div>`;
  }).join('');



  document.getElementById("news-board").innerHTML= newsHTML;
}


const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
  </div>`;
  document.getElementById("news-board").innerHTML = errorHTML

}

const pagenation = () =>{
  let pagenationHTML = ``;

  let pageGroup = Math.ceil(page/5)
  let last = pageGroup * 5;
  let first = last - 4;

  pagenationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick='moveToPage(${page-1})'>
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`

  for(let i=first; i<=last; i++){
    pagenationHTML+= `<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick='moveToPage(${i})'>${i}</a></li>`
  }

  pagenationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick='moveToPage(${page+1})'>
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`

  document.querySelector(".pagination").innerHTML=pagenationHTML;
}

const moveToPage = (pageNum) =>{
  page = pageNum;
  console.log(page);

  getNews();
}

searchButton.addEventListener("click",getNewsByKeyword)
getLatestNews ();