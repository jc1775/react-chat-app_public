import { useEffect } from 'react';
import MiniContact from './MiniContact'
import 'firesql/rx'; // <-- Important! Don't forget
import 'firebase/firestore';

const ContactsBar = (props) => {
    let allUsers = props.allUsers
    let setChatMembers = props.setChatMembers
    let setReloadContacts = props.setReloadContacts
    let minimizeEverything = props.minimizeEverything
    let setMinimizeEverything = props.setMinimizeEverything

    var active = false;
    var contactActive1 = false;
    var contactActive2 = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    var maximized = false;
    var minimized = true;
    var lastYCheck = 9999999;
    var lastXCheck = 9999999;
    var currentChatMembers = []

    var dragItem
    var container
    var container2
    var miniButtonEle
    var newChatWindow
    var miniButtonImg
    var navbarHeight
    var allMiniContacts
    var dragOverlay

    function startListeningMaxMove() {
        container.addEventListener("mousemove", drag, false);
        container.addEventListener("touchmove", drag, false);

        container2.addEventListener("mousemove", drag, false);
        container2.addEventListener("touchmove", drag, false);
    }

    function startListeningMinMove() {
        newChatWindow.addEventListener("mousemove", drag, false);
        newChatWindow.addEventListener("touchmove", drag, false);
    }

    function StartListeningMaxTouch(){
        
        container.addEventListener("touchstart", dragStart, false);
        container.addEventListener("touchend", dragEnd, false);

        container.addEventListener("mousedown", dragStart, false);
        container.addEventListener("mouseup", dragEnd, false);

        container2.addEventListener("touchstart", dragStart, false);
        container2.addEventListener("touchend", dragEnd, false);
        
        container2.addEventListener("mousedown", dragStart, false);
        container2.addEventListener("mouseup", dragEnd, false);
    }

    function StartListeningMinTouch(){
        newChatWindow.addEventListener("touchstart", dragStart, false);
        newChatWindow.addEventListener("touchend", dragEnd, false);

        newChatWindow.addEventListener("mousedown", dragStart, false);
        newChatWindow.addEventListener("mouseup", dragEnd, false);

        miniButtonEle.addEventListener("click", minimizeContacts, false);
        miniButtonEle.style.pointerEvents = "all"
        
    }

    function dragStart(e) {
        if (maximized === false && minimized === true) {
            startListeningMaxMove()
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            if (e.target === dragItem || e.target === container2) {
                active = true;
            }
        }   if (maximized === true && minimized === false) {
            startListeningMinMove()
                if (e.type === "touchstart") {
                    initialX = e.touches[0].clientX - xOffset;
                    initialY = e.touches[0].clientY - yOffset;
                } else {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                }

                if (e.target === dragItem || e.target === container2 || e.target === newChatWindow) {
                    active = true;
                }
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        active = false;
    }

    function drag(e) {
        if (active) {
            e.preventDefault();
            initialY = 0
            if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
            } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;
            if (0 <= currentY){
                setTranslate(currentX, currentY, dragItem);
            } else {
            }
        }
    }
        
    function setTranslate(xPos, yPos, el) {
        if (1 <= yPos ){
            if (maximized === false ){
                el.style.transform = "translate3d(" + 0 + "px, " + (navbarHeight - 1) + "px, 0)";
                miniButtonImg.style.transform = "rotate(180deg)"
                
                container.removeEventListener("touchstart", dragStart, false);
                container.removeEventListener("touchend", dragEnd, false);
                container.removeEventListener("touchmove", drag, false);

                container.removeEventListener("mousedown", dragStart, false);
                container.removeEventListener("mouseup", dragEnd, false);
                container.removeEventListener("mousemove", drag, false);
                
                container2.removeEventListener("touchstart", dragStart, false);
                container2.removeEventListener("touchend", dragEnd, false);
                container2.removeEventListener("touchmove", drag, false);

                container2.removeEventListener("mousedown", dragStart, false);
                container2.removeEventListener("mouseup", dragEnd, false);
                container2.removeEventListener("mousemove", drag, false);

                newChatWindow.style.display = "grid"
                newChatWindow.style.pointerEvents = "all"
                setTimeout(function(){
                    StartListeningMinTouch()
                    addMiniContactListeners()
                    maximized = true
                    minimized = false
                    container.style.pointerEvents= "none"
                    dragOverlay.style.display = "block"
                    
                    
                },500)

            } else if (maximized === true ){
                el.style.transform = "translate3d(" + 0 + "px, " + 0 + "px, 0)";
                miniButtonImg.style.transform = "rotate(0deg)"
                
                newChatWindow.removeEventListener("touchstart", dragStart, false);
                newChatWindow.removeEventListener("touchend", dragEnd, false);
                newChatWindow.removeEventListener("touchmove", drag, false);

                newChatWindow.removeEventListener("mousedown", dragStart, false);
                newChatWindow.removeEventListener("mouseup", dragEnd, false);
                newChatWindow.removeEventListener("mousemove", drag, false);
                
                miniButtonEle.removeEventListener("click", minimizeContacts, false);
                
                miniButtonEle.style.pointerEvents = "none"
                clearContacts()
                setMinimizeEverything(true)

                setTimeout(function(){
                    newChatWindow.style.pointerEvents = "none"
                    newChatWindow.style.display = "none"
                    dragOverlay.style.display = "none"
                    maximized = false
                    minimized = true
                    container.style.pointerEvents= "all"
                    StartListeningMaxTouch()
                    removeMiniContactListeners()

                },500)
                
            } else {
                el.style.transform = "translate3d(" + 0 + "px, " + yPos + "px, 0)";
            }
            
        }
    }

    function clearContacts(){
        allMiniContacts.forEach(element => {
            document.querySelector("div.contactsHolder").appendChild(element)
            element.style.transform = "translate3d(" + 0 + "px, " + 0 + "px, 0)";
        });
        setChatMembers([])
        currentChatMembers = []
        setReloadContacts(true)
    }

    function minimizeContacts() {
        if (maximized === true){
            container.style.transform = "translate3d(" + 0 + "px, " + 0 + "px, 0)";
            maximized = false
            minimized = true
            miniButtonImg.style.transform = "rotate(0deg)"
            miniButtonEle.style.pointerEvents = "none"
            miniButtonEle.removeEventListener("click", minimizeContacts, false);
            StartListeningMaxTouch()
            removeMiniContactListeners()
            container.style.pointerEvents = "all"
            newChatWindow.style.display = "none"
            dragOverlay.style.display = "none"
            clearContacts()
            
            
        }
    }
 
    function addMiniContactListeners() {
        allMiniContacts.forEach(element => {
            element.addEventListener("touchstart", miniContactDragStart, false);
            element.addEventListener("touchend", miniContactDragEnd, false);
    
            element.addEventListener("mousedown", miniContactDragStart, false);
            element.addEventListener("mouseup", miniContactDragEnd, false);

            element.addEventListener("mousemove", miniContactDrag, false);
            element.addEventListener("touchmove", miniContactDrag, false);
        });
    }

    function removeMiniContactListener(element) {
        element.removeEventListener("touchstart", miniContactDragStart, false);
        element.removeEventListener("touchend", miniContactDragEnd, false);

        element.removeEventListener("mousedown", miniContactDragStart, false);
        element.removeEventListener("mouseup", miniContactDragEnd, false);

        element.removeEventListener("mousemove", miniContactDrag, false);
        element.removeEventListener("touchmove", miniContactDrag, false);

    }

    function removeMiniContactListeners() {
        allMiniContacts.forEach(element => {
            element.removeEventListener("touchstart", miniContactDragStart, false);
            element.removeEventListener("touchend", miniContactDragEnd, false);
    
            element.removeEventListener("mousedown", miniContactDragStart, false);
            element.removeEventListener("mouseup", miniContactDragEnd, false);

            element.removeEventListener("mousemove", miniContactDrag, false);
            element.removeEventListener("touchmove", miniContactDrag, false);
        });
    }

    function nodeIncludes(nodeList, nodeToFind) {
        var foundIt = false
        nodeList.forEach(node => {
            if (node === nodeToFind){
                foundIt = true
            } 
        });
        if (foundIt){
            return true
        } else{
            return false
        }
    }

    function miniContactDragStart(e) {

        if (maximized === true) {
            startListeningMaxMove()
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            if (nodeIncludes(allMiniContacts,e.target)) {
                contactActive1 = true;
            }   
        }
    }

    function miniContactDragEnd(e) {
        if (contactActive2){
            e.target.style.transitionDuration = "500ms"
            e.target.style.transform = e.target.style.transform + " scale(0.1)"
            setTimeout(function(){
                e.target.setAttribute("selected","true")
                removeMiniContactListener(e.target)
                document.querySelector("div.chatFormation").appendChild(e.target)
                currentChatMembers.push(e.target)
                var tempNewVar = [...currentChatMembers]
                setChatMembers(tempNewVar)

                e.target.style.transform = "scale(1)"
            },500)
        }
        initialX = currentX;
        initialY = currentY;
        contactActive2 = false;
        contactActive1 = false;
        lastYCheck = 99999;
        lastXCheck = 99999;
    }

    function miniContactDrag(e) {

        var scrollLeeway = 2
        if (contactActive1){
            if (e.type === "touches" || e.type === "touchmove"){
                if (!contactActive2 && lastYCheck >= e.touches[0].clientY && ((lastXCheck - scrollLeeway) > e.touches[0].clientX || e.touches[0].clientX > (lastXCheck + scrollLeeway))){
                    lastXCheck = e.touches[0].clientX
                    lastYCheck = e.touches[0].clientY
                }else if ((!contactActive2) && (lastYCheck < e.touches[0].clientY) && ((lastXCheck - scrollLeeway) < e.touches[0].clientX && e.touches[0].clientX < (lastXCheck + scrollLeeway)) ){
                    lastXCheck = e.touches[0].clientX
                    lastYCheck = e.touches[0].clientY
                    contactActive2 = true;
                }
            }else if (e.type === "mousemove"){
                if (!contactActive2 && lastYCheck >= e.clientY){
                    lastYCheck = e.clientY

                }else if (!contactActive2 && lastYCheck < e.clientY){

                    lastYCheck = e.clientY
                    contactActive2 = true;
                }
            }       
        }
        if (contactActive2) {
            e.preventDefault();
            initialY = e.target.clientHeight / 2
            initialX = e.target.clientWidth / 2
            
            if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
            } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;
            if (0 <= currentY){
                miniContactSetTranslate(currentX, currentY, e.target);
            } else {
                console.log("Error" + currentY)
            }
        }
    }

    function miniContactSetTranslate(xPos, yPos, el) {
        dragOverlay.appendChild(el)
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";        
    }

    useEffect(() =>{
        if (minimizeEverything) {
            setMinimizeEverything(false)
            dragItem = document.querySelector("div.contactsBar");
            container = document.querySelector("button.minimize");
            container2 = document.querySelector("nav.navbar")
            miniButtonEle = document.querySelector("button.minimize")
            newChatWindow = document.querySelector("div.newChat")
            miniButtonImg = document.querySelector("img.minimizerImg")
            navbarHeight = document.querySelector("nav.navbar").clientHeight
            allMiniContacts = document.querySelectorAll("div.miniContact")
            dragOverlay = document.querySelector("div.dragOverlay")

            dragItem.style.transform = "translate3d(" + 0 + "px, " + 0 + "px, 0)";
            miniButtonImg.style.transform = "rotate(0deg)"
            
            newChatWindow.removeEventListener("touchstart", dragStart, false);
            newChatWindow.removeEventListener("touchend", dragEnd, false);
            newChatWindow.removeEventListener("touchmove", drag, false);

            newChatWindow.removeEventListener("mousedown", dragStart, false);
            newChatWindow.removeEventListener("mouseup", dragEnd, false);
            newChatWindow.removeEventListener("mousemove", drag, false);
            
            miniButtonEle.removeEventListener("click", minimizeContacts, false);
            
            miniButtonEle.style.pointerEvents = "none"
            clearContacts()
            setTimeout(function(){
                newChatWindow.style.pointerEvents = "none"
                newChatWindow.style.display = "none"
                dragOverlay.style.display = "none"
                maximized = false
                minimized = true
                container.style.pointerEvents= "all"
                StartListeningMaxTouch()
                removeMiniContactListeners()

            },500)
        }
    },[minimizeEverything])

    useEffect(() => {
        dragItem = document.querySelector("div.contactsBar");
        container = document.querySelector("button.minimize");
        container2 = document.querySelector("nav.navbar")
        miniButtonEle = document.querySelector("button.minimize")
        newChatWindow = document.querySelector("div.newChat")
        miniButtonImg = document.querySelector("img.minimizerImg")
        navbarHeight = document.querySelector("nav.navbar").clientHeight
        allMiniContacts = document.querySelectorAll("div.miniContact")
        dragOverlay = document.querySelector("div.dragOverlay")
        document.querySelector("div.contactsHolder").onscroll = function (e) { contactActive1 = false }

        StartListeningMaxTouch()
    },[allUsers])
    

    return ( 
        <div className="contactsBar">
            <div className="contactsHolder" >
            {allUsers.map((user) =>(
                <MiniContact 
                key={user.uid} 
                contactImage={user.contact_picture} 
                email={user.email}
                displayName = {user.display_name}
                ></MiniContact>
            ))}
            </div>
            
            <button className="minimize" >
                <img className="minimizerImg" src="down-arrow.svg" alt="" />
            </button>
        </div>
     );
}
 
export default ContactsBar;