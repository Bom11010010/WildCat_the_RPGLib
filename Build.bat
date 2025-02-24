PowerShell Compress-Archive -Path ".\src\*" -DestinationPath "C:\nwjs-sdk\Noova.zip" -Force

copy /b C:\nwjs-sdk\nw.exe + C:\nwjs-sdk\Noova.zip C:\nwjs-sdk\Noova.exe

C:\nwjs-sdk\Noova.exe