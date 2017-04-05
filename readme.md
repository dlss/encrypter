# encrypt or decrypt files
encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alg "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --files "."   
encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alg "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --files "test/music/mp4"   
encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alg "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --files "d:\test"   
encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alg "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --files ".;d:\test;test/music/mp4"   
encrypter de --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alg "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --files ".;d:\test;test/music/mp4"   

# encrypt or decrypt with config file in current path 'encrypter.txt' or a special path 'd:\encryptinfo.txt'
encrypter en --config "d:\encryptinfo.txt"    
encrypter de --config "encryptinfo.txt"    

encryptinfo.txt:
```
ep=D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe
p.key=13589!1120161223@)!^!@#$
p.iv=@)!^!@#$
p.alg=TripleDES

# files=d:\test
# files=.
# files=test/music/mp4
# ignore=.gitignore|encrypter.ignore
```
