global frontApp, frontAppName, windowTitle
set windowTitle to ""
tell application "System Events"
    set frontApp to first application process whose frontmost is true
    set frontAppName to name of frontApp
    set windowTitle to "no window"
    tell process frontAppName
        if exists (1st window whose value of attribute "AXMain" is true) then
            tell (1st window whose value of attribute "AXMain" is true)
                set windowTitle to value of attribute "AXTitle"
            end tell
        end if
    end tell
end tell
return {frontAppName,windowTitle}
