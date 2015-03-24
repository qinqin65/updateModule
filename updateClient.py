# -*- coding: UTF-8 -*-
#coding=utf-8

import socket
import os
import math
#import time

IP = 'localhost'
PORT = 12008

class Sock:
    def __init__(self,ip,port):
        try:
            self.sock=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
            self.sock.connect((ip,port))
        except Exception,e:
            print e

    def __del__(self):
        self.sock.close()

class File:
    def __init__(self,fileName):
        try:
            self.myFile = file(fileName)
        except Exception,e:
            print e

    def getFileData(self):
        return self.myFile.readlines()

    def __del__(self):
        self.myFile.close()

def update(fileName):
    ret = True
    mySock = Sock(IP,PORT)
    if(mySock.sock==None):
        print 'connect failed!'
        return False
    try:
        f = open(fileName+'.tmp','wb')
        mySock.sock.send('get:'+fileName.lstrip('../'))
        size = int(mySock.sock.recv(1024))
        recSize = 0
        while(recSize!=size):
            data = mySock.sock.recv(1024)
            f.write(data)
            recSize += len(data)
            #print 'recived data:',len(data),'&recSize:',recSize,'&size:',size
        print fileName+' size:'+str(size)+'KB','recv size:'+str(recSize)+'KB'
    except Exception,e:
        print e
        ret = False
    finally:
        f.close
    return ret

def getData(inst):
    mySock = Sock(IP,PORT)
    if(mySock.sock==None):
        print 'connect failed!'
        exit(1)
    mySock.sock.send(inst)
    return mySock.sock.recv(1024)

def getVer():
    if not os.path.exists('../config.cfg'):
        return 'Null'
    oldCfg = File('../config.cfg').getFileData()
    for item in oldCfg:
        isExist = item.find('Version')
        if(isExist >= 0):
            if(item.find('#') == -1):
                tmp = item.strip ()
                return item[item.find('=')+1:]
    return 'Null'

def mergeCfg():
    if not os.path.exists('../config.cfg'):
        print 'dont\'t need to merge'
        return
    try:
        content = File('../config.cfg.tmp').getFileData()
        oldCfg = File('../config.cfg').getFileData()
        f = file('../config.cfg.tmp','wb')
        newCfg = ''
        for line in content:
            isMerge = False
            for oldLine in oldCfg:
                tmpOld = oldLine[:oldLine.find('=')].strip()
                tmpNew = line[:line.find('=')].strip()
                tmpAfOld = oldLine[oldLine.find('='):].strip()
                tmpAfNew = line[line.find('='):].strip()
                if(tmpOld=='Version'):
                    continue
                elif(tmpOld==tmpNew and tmpAfOld<>tmpAfNew):
                    if(oldLine.find('#')==-1):
                        isMerge = True
                        newCfg += oldLine + os.linesep
                        print oldLine
                        break
            if(not isMerge):
                newCfg += line + os.linesep
        f.write(newCfg)            
    except Exception,e:
        print e
        print 'merge failed!'
    finally:
        f.close

def commit(fileName):
    if(fileName=='../config.cfg'):
        mergeCfg()
    if os.path.exists(fileName):
        os.remove(fileName)
    if os.path.exists(fileName+'.tmp'):
        os.rename(fileName+'.tmp',fileName)

def main():
    print 'updating...'

    ver = getVer().strip()
    data = getData('getVer').strip()
    print ver,data
    if(ver==data):
        print 'current version is the newest'
        exit(1)
    else:
        verInfo = getData('getVerInfo').split(';')
        for info in verInfo:
            print info
        updLis = getData('getUpdLis').split(';')
        for lis in updLis:
            if(not update(lis)):
                print 'failed to update '+lis
                exit(1)
            commit(lis)
        print 'update completed'

if __name__=='__main__':
    main()