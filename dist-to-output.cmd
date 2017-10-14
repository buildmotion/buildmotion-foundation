REM %1 --> VERSION.
REM Example: buildmotion-foundation-%1 becomes buildmotion-foundation-1.0.0
xcopy dist\*.* ..\..\output\buildmotion-foundation\buildmotion-foundation-%1\ /s