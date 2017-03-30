# encrypt or descrpt file or text
	## encrypt content of file "d:\1.txt" and output into "d:\1.txt_encrypt" 
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --p.file "d:\1.txt" --p.out "d:\1.txt_encrypt"

	## decrypt content of file "1.txt_encrypt" and output into "d:\1.txt" 
	encrypter de --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --p.file "d:\1.txt_encrypt" --p.out "d:\1.txt"

	## encrypt content of file "d:\1.txt" and output to console
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --p.file "d:\1.txt" --p.ver "1"

	## decrypt content of file "1.txt_encrypt" and output to console
	encrypter de --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --p.file "d:\1.txt_encrypt" --p.ver "1"

	## encrypt text 'test123' and output into "d:\2.txt_encrypt" 
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --p.str "test123" --p.out "d:\2.txt_encrypt"

	## decrypt text 'uUQGG6oefEamOOlrNKDX+w==' and output into "d:\2.txt" 
	encrypter de --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --p.str "uUQGG6oefEamOOlrNKDX+w==" --p.out "d:\2.txt"

	## encrypt text 'test123' and output to console
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --p.str "test123" --p.ver "1"

	## decrypt text 'uUQGG6oefEamOOlrNKDX+w==' and output to console
	encrypter de --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --p.str "uUQGG6oefEamOOlrNKDX+w==" --p.ver "1"

	## encrypt or decrypt a path
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --path "."
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --path "."
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --path "test/music/mp4"
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --path "test/music/mp4"
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --path "d:\test"
	encrypter en --ep "D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe" --p.alt "TripleDES" --p.key "13579!#%abc23@&#9df!@232" --p.iv "13579!#%" --path "d:\test"
	

# encrypt or decrypt with config file

# encrypt or decrypt with config file in current path 'encrypter.txt' or a special path 'd:\encryptinfo.txt'
	encrypter en --config "d:\encryptinfo.txt"
	encrypter de --config "encryptinfo.txt"

	encryptinfo.txt:
	```
		ep=D:\GreenTools\Tools\MyTools\BackendTool\BackendTool.exe
		p.key=13589!1120161223@)!^!@#$
		p.iv=@)!^!@#$
		p.alt=TripleDES

		# path
		# path=d:\test
		# path=.
		# path=test/music/mp4
		# ignore=.gitignore|encrypter.ignore

		# a file
		#p.file=d:\1.txt
		#p.ver=1

		# text
		#p.str=test789
		#p.out=d:\1.txt_encrypt
		#p.ver=1
	```