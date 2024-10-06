// ... (rest of the code remains the same)

const { collins } = require("../Collins/collins");
const { getMessagesAndXPByJID, getBottom10Users } = require("../lib/level");

// ... (rest of the code remains the same)

adams( {
  nomCom : "rank",
 categorie : "Fun",
   }, 
   async(dest,zk, commandeOptions)=> {
  
    const {ms , repondre,auteurMessage,nomAuteurMessage, msgRepondu , auteurMsgRepondu , mybotpic} = commandeOptions ;

  if (msgRepondu) {
      
       try {
          
        let rank = await getMessagesAndXPByJID(auteurMsgRepondu) ;

        const data = await get_level_exp(rank.xp)
         let ppuser ;
    
         
         try {
              ppuser = await zk.profilePictureUrl(auteurMsgRepondu , 'image') ;
         } catch {
            ppuser = mybotpic()
         } ;
    
    
         let role ;
    
         if (data.level < 5) {
            role = 'baby'
         } else if (data.level >= 5 && data.level < 10) {
            role = 'kid-Ninja'
         } else if ( data.level >= 10 && data.level < 15 ) {
            role = 'Ninja-genin'
         } else if ( data.level >= 15 && data.level < 20 ) {
            role = 'Ninja-chunin'
         } else if ( data.level >= 20 && data.level < 25 ) {
            role = 'Ninja-jonin'
         } else if ( data.level >= 25 && data.level < 30 ) {
            role = 'ANBU'
         } else if ( data.level >= 30 && data.level < 35 ) {
            role = 'strong ninja'
         } else if ( data.level >= 35 && data.level < 40 ) {
            role = 'kage'
         } else if ( data.level >= 40 && data.level < 45 ) {
            role = 'Hermit seinin'
         } else if ( data.level >= 45 && data.level < 50 ) {
            role = 'Otsusuki'
         } else {
            role = 'GOD'
         }
    
    
         let msg = `
┏━━━┛ Bmw-Rang ┗━━━┓
         
    *Name :* @${auteurMsgRepondu.split("@")[0]}
    
    *Level :* ${data.level}
    
    *EXP :* ${data.exp}/${data.xplimit}
    
    *Role :* ${role}

    *Messages :* ${rank.messages}
    
   ┕━✿━┑  ┍━✿━┙`
    
     zk.sendMessage( 
        dest,
        {
            image : {url : ppuser},
            caption : msg,
            mentions : [auteurMsgRepondu]
        },
        {quoted : ms}
      )


       } catch (error) {
         repondre(error)
       }
  }   else {


      try {
        
        let jid = auteurMessage ;
          
        let rang = await getMessagesAndXPByJID(jid) ;

        const data =  get_level_exp(rang.xp)
         let ppuser ;
    
         
         try {
              ppuser = await zk.profilePictureUrl(jid, 'image') ;
         } catch {
            ppuser = mybotpic()
         } ;
    
    
         let role ;
    
         if (data.level < 5) {
            role = 'Nouveau né(e)'
         } else if (data.level >= 5 && data.level < 10) {
            role = 'kid-Ninja'
         } else if ( data.level >= 10 && data.level < 15 ) {
            role = 'Ninja-genin'
         } else if ( data.level >= 15 && data.level < 20 ) {
            role = 'Ninja-chunin'
         } else if ( data.level >= 20 && data.level < 25 ) {
            role = 'Ninja-jonin'
         } else if ( data.level >= 25 && data.level < 30 ) {
            role = 'ANBU'
         } else if ( data.level >= 30 && data.level < 35 ) {
            role = 'strong ninja'
         } else if ( data.level >= 35 && data.level < 40 ) {
            role = 'kage'
         } else if ( data.level >= 40 && data.level < 45 ) {
            role = 'Hermit seinin'
         } else if ( data.level >= 45 && data.level < 50 ) {
            role = 'Otsusuki'
         } else {
            role = 'GOD'
         }
    
    
         let msg = `
┏━━━┛ Bmw-Rang ┗━━━┓
         
    *Name :* @${jid.split("@")[0]}
    
    *Level :* ${data.level}
    
    *EXP :* ${data.exp}/${data.xplimit}
    
    *Role :* ${role}

    *Messages :* ${rang.messages}
    
   ┕━✿━┑  ┍━✿━┙`
    
     zk.sendMessage( 
        dest,
        {
            image : {url : ppuser},
            caption : msg,
            mentions : [jid]
        },
        {quoted : ms}
      )


       } catch (error) {
         repondre(error)
       }
  }
  }
  )
