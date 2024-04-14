from fastapi import FastAPI, Form, Response,UploadFile,Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from fastapi.staticfiles import StaticFiles
from typing import Annotated
from typing import List
from pydantic import BaseModel
import sqlite3



con = sqlite3.connect('worddb.db',check_same_thread=False)
cur = con.cursor()

class Game(BaseModel):
    code:str
    title: str
    description: str
    wordlist: List[str]

app = FastAPI()

def create_database():
    con = sqlite3.connect('worddb.db')
    cur = con.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS games (
       code INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        wordlist TEXT NOT NULL
    );
    """)
    con.commit()
    con.close()

create_database()  # 애플리케이션 시작 시 데이터베이스 및 테이블 생성


SERCRET = "woo1116" 
#액세스 토큰을 어떻게 인코딩 할지 결정하는 것 디코딩에서 사용가능해서 이 SECRET 키 노출시키면 언제든 우리 JWT 해석 가능
manager = LoginManager(SERCRET,'/login') # 로그인 매니저  

@manager.user_loader()

def query_user(data): # 유저 데이터가 액세스 토큰 내의 dict형태이기 때문에 유저 데이터 내부의 id 찾아서 비교
    WHERE_STATEMENTS = f'id="{data}"'
    if type(data) == dict:
        WHERE_STATEMENTS = f'''id="{data['id']}"'''
    con.row_factory = sqlite3.Row #컬럼명도 같이 가져오는 문법
    cur = con.cursor()
    user = cur.execute(f"""
                       SELECT * FROM users WHERE { WHERE_STATEMENTS }
                       """).fetchone()    
    return user
@app.post('/login')
def login(id:Annotated[str,Form()],
           password:Annotated[str,Form()]):
    user = query_user(id) #가져온값을 유저에 넣음 
    
    if not user: # 유저 데이터가 없을 때
        raise InvalidCredentialsException
    elif password != user['password']: #패스워드가 , user 데이터의 password와 다를 때
        raise InvalidCredentialsException #status 401 code 내려줌 
    # return 'hi' #이런식으로 아무거나 반환하게 하더라도 성공했을때는 status 200 code 내려줌 
    access_token = manager.create_access_token(data = {
        'sub': {
            'id' : user['id'],
            'name' : user['name'],
            'email':user['email']
        }

    })
    return {'access_token':access_token}

@app.post('/signup') #get이 아니라 post 인 이유 -> 프론트에서 값을 받아서 서버로 보내주기 때문에 (서버에서 값 프론트로 보내면 get)
def signup(id:Annotated[str,Form()],
           password:Annotated[str,Form()],
           name:Annotated[str,Form()],
           email:Annotated[str,Form()]
           ):
    cur.execute(f"""
                INSERT INTO users(id,name,email,password)
                VALUES ('{id}','{name}','{email}','{password}') 
                """) #생성한 DB에 속성 , 값 추가 
    con.commit()
   
    return '200'


@app.post("/playgame")
async def submit_game(game: Game):
        # 데이터베이스에 게임 데이터 삽입
        cur.execute(f"INSERT INTO games (code,title, description, wordlist) VALUES ('{game.code}','{game.title}', '{game.description}', '{','.join(game.wordlist)}')")
        con.commit()
        return {"message": "Game submitted successfully"}


@app.get("/games/{game_code}")
async def get_game(game_code: str):
    cur = con.cursor()
    cur.row_factory = sqlite3.Row  # 결과를 딕셔너리 형태로 받기
    game = cur.execute("SELECT * FROM games WHERE code = ?", (game_code,)).fetchone()
    
    if game is None:
        return {"error": "게임을 찾을 수 없습니다."}
    
    # wordlist를 콤마로 분리하여 리스트로 변환
    game_data = dict(game)
    game_data['wordlist'] = game['wordlist'].split(',')
    
    return game_data



app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")




