@echo off

echo Attempting Install from: '%CD%'
echo .

REM | If the path has a space in it, the version of Node bundled with Discord will break.
REM | As such, tell the user and abandon the process. 
IF NOT "%CD%"=="%CD: =%" (
  echo Error!
  echo The current install location cannot be used as there is a space in the path.
  echo Please change the install location to a path with no space in it.
  pause
)

setx NODE_OPTIONS "--require %CD%\index.js"
echo Setup Successful. Please completely restart Discord.
pause