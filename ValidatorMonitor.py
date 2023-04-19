
from http.server import HTTPServer, BaseHTTPRequestHandler
import cgi  
from io import BytesIO
import io
import json                    
import base64

import sqlite3

import requests
from time import gmtime, strftime,sleep

from safecoin.keypair import Keypair
from safecoin.rpc.api import Client
from safecoin.rpc.types import MemcmpOpts
from safecoin.publickey import PublicKey

  
cursor = sqlite3.connect('ValidatorDB.db')

api_endpoints={"mainnet":"https://api.mainnet-beta.safecoin.org",
               "devnet":"https://api.devnet.safecoin.org",
               "testnet":"https://api.testnet.safecoin.org"}


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
        
    def do_GET(self):
        if('AllValData' in self.path):
            #endpint = api_endpoints[row[5]]
            endpint = api_endpoints['mainnet']
            print(endpint)
            allValIDs = []
            client = Client(endpint)
            if(client.is_connected() == True):
                    allValIDs.append("Vote-Identity\n")
                    allValIDs.append("Online\n")
                    validatorList = (client.get_vote_accounts()['result']['current'])
                    #print(validatorList)
                    for vals in validatorList:
                        nodePubkey = vals['nodePubkey']
                        votePubkey = vals['votePubkey']
                        print(nodePubkey,votePubkey)
                        allValIDs.append(nodePubkey + "-" + votePubkey)
                    allValIDs.append("\n\r delinquent\n")
                    validatorList = (client.get_vote_accounts()['result']['delinquent'])
                    #print(validatorList)
                    for vals in validatorList:
                        nodePubkey = vals['nodePubkey']
                        votePubkey = vals['votePubkey']
                        print(nodePubkey,votePubkey)
                        allValIDs.append(nodePubkey + "-" + votePubkey)
                            





            
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(allValIDs).encode())




            
        elif('ValData' in self.path):
            PubKey = self.path.split("/")[2]
            print(PubKey)
            cursor = sqlite3.connect('ValidatorDB.db')
            cur = cursor.cursor()
            cur.execute("SELECT * FROM ValidatorPayment")

            rows = cur.fetchall()
            cursor.close()
            myDelqVal = []
            allDelqVal = []
            for row in rows:
                print(row)
                if(PubKey in row[0]):
                    print("got pubkey saved for %s"%row[5])
                    #endpint = api_endpoints[row[5]]
                    endpint = api_endpoints['mainnet']
                    print(endpint)
                    client = Client(endpint)
                    ValID = row[2].split()
                    print(ValID)
                    if(client.is_connected() == True):
                            validatorList = (client.get_vote_accounts()['result']['delinquent'])
                            #print(validatorList)
                            for vals in validatorList:
                                nodePubkey = vals['nodePubkey']
                                votePubkey = vals['votePubkey']
                                print(nodePubkey,votePubkey)
                                for ValidatorID in ValID:
                                    if(ValidatorID in nodePubkey or ValidatorID in votePubkey):
                                        print("^^^^^^^^^^^^^^^^^^^found my Validator^^^^^^^^^^^^^^^^^^")
                                        myDelqVal.append(nodePubkey + "-" + votePubkey)
                                    else:
                                        allDelqVal.append(nodePubkey + "-" + votePubkey)
                            self.send_response(200)
                            self.send_header('Access-Control-Allow-Origin', '*')
                            self.send_header('Content-type', 'application/json')
                            self.end_headers()
                            self.wfile.write(json.dumps((myDelqVal,allDelqVal)).encode())
                            return
                            
                                        
                    else:
                        print("client Not Connected")
                        

                            
            
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            myDelqVal.append("To use the Validating montoring feature, please click on the validator monitor setup tab")
            allDelqVal.append("empty")
            self.wfile.write(json.dumps((myDelqVal,allDelqVal)).encode())

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        #try:
            form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD':'POST',
                             'CONTENT_TYPE':self.headers['Content-Type']}
                    )
            tx = form.getfirst("transaction")
            print('transaction : ', tx)
            Vote = form.getfirst("Vote")
            print('Vote : ', Vote)
            Discord = form.getfirst("Discord")
            print('Discord : ', Discord)
            Chain = form.getfirst("Chain")
            print('Chain : ', Chain)
            pubkey = form.getfirst("publicKey")
            print('pubkey : ', pubkey)
            EmailAdd = "" #for future

            cursor = sqlite3.connect('ValidatorDB.db')
            cursor.execute("""CREATE TABLE IF NOT EXISTS ValidatorPayment
                (pubkey TEXT PRIMARY KEY,tx TEXT,Vote TEXT,EmailAdd TEXT,Discord TEXT,Chain TEXT);""")
            try:
                cursor.execute("""INSERT INTO ValidatorPayment (pubkey, tx, Vote, EmailAdd, Discord,Chain)
                            VALUES(?, ?, ?, ?, ?, ?);""", (str(pubkey), str(tx),Vote,EmailAdd,Discord,Chain))
            except:
                cursor.execute ("""
                   UPDATE ValidatorPayment
                   SET tx=(?), Vote=(?), EmailAdd=(?), Discord=(?), Chain=(?)
                   WHERE pubkey=(?)
                """, (str(tx),Vote, EmailAdd, Discord, Chain, str(pubkey)))
            cursor.commit()
            cursor.close()

            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps('ok').encode())
            



httpd = HTTPServer(('127.0.0.1', 8080), SimpleHTTPRequestHandler)
#httpd = HTTPServer(('185.213.27.58', 80), SimpleHTTPRequestHandler)
httpd.serve_forever()
