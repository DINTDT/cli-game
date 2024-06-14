Help = {
	name:"help",
	description:"Shows a list of available commands. Type \"help help\" for more details",
	helpPage:()=>{
		println("HELP [comm]");
		println("Gives a list of all available commands.");
		println("If [comm] is present and is one of the available commands, "+
			"it shows the help page for that command.");
		println("In the help page, parameters shown in square brackets (\"[]\") are "+
			"optional, and parameters shown in angle brackets have different variants but is required.");
	},
	execute:(params)=>{
		if(params[0]){
			if(params[0] in avComms){
				avComms[params[0]].helpPage()
			} else {
				print("Help page for command \""+params[0]+"\" not found","color:#ff0");
			}
		} else {
			println("Here's a list of available commands:");
			let padEnd=0
			for(command in avComms){
				padEnd=Math.max(padEnd,avComms[command].name.length)
			}
			for(command in avComms){
				println(avComms[command].name.toUpperCase().padEnd(padEnd+2)+avComms[command].description)
			}
		}
		println("");
	}
}

Hint = {
	name:"hint",
	description:"Provides a clue for the next step",
	helpPage:()=>{
		println("HINT");
		println("This command tracks your progress along the game, and can provide "+
			"a clue for what you're meant to do next.");
		println("Use this when you're stuck and are not sure how to continue.");
	},
	execute:()=>{
		switch(chapter){
		//Not logged in
			case 0:
				println("You're not logged in. Use the LOGIN command to log in. Use \"help login\" if "+
					"you need help with the command."); break;
		//Logged in
			case 1:
				println("This is the end of the game so far."); break;
			default:
				println("You're on your own :^)"); break;
		}
	}
}

Type={
	name:"type",
	description:"Types out a message one character at a time",
	helpPage:()=>{
		println("TYPE [-dXX] message");
		println("Types out the given message one character at a time.");
		println("If [-dXX] is present and XX is a non-negative integer, the "+
			"delay between character prints will be that many milliseconds.");
	},
	execute:async (params)=>{
		setPrompt("");
		let delay=50;
		let customDelay=false;
		if(params.length==0){
			println("Missing message. Use \"help type\" to see the help page for this command.","color:#ff0")
		} else {
			setPrompt("");
			if(params.length>1 && params[0].length > 2 && params[0].substring(0,2)=="-d"){
				delay=parseInt(params[0].substring(2));
				customDelay=true;
			}
			await typeout(params.slice(customDelay?1:0,params.length+1).join(" "),delay);
			println();
		}
		println();
		setPrompt();
	}
}

Clear={
	name:"clear",
	description:"Clears the output screen",
	helpPage:()=>{
		println("CLEAR");
		println("Clears the output screen.");
	},
	execute:()=>{
		get("output").innerHTML="";
	}
}

Login={
	name:"login",
	description:"Allows a user to authenticate as a registered user, or as a guest",
	helpPage:()=>{
		println("LOGIN");
		println("Prompts you for your username, then your password. If they are recognized, "+
			"you will be logged in and be able to use the commands that correspond to your access level.");
		println("If you are not registered, you may log in as a guest using the credentials USER = \"guest\" "+
			"and PASSWORD = \"guest\".")
	},
	execute:()=>{
		ask("Username: ",(name)=>{
			get("input").setAttribute("type","password")
			ask("Password: ",(pass)=>{
				get("input").setAttribute("type","text")
				if(name!="guest"){
					println("User not found","color:#ff0")
				} else {
					if(pass!="guest"){
						println("Incorrect password","color:#ff0")
					} else {
						println("Successfully logged in as <i>guest</i>")
						chapter=Math.max(chapter,1);
						uname="guest"
						avComms["type"]=Type
						avComms["clear"]=Clear
						setPrompt();
					}
				}
				println("");
			})
		})
	}
}

Memo={
	name:"memo",
	description:"Notetaking manager. Create, read, edit, or delete memos.",
	helpPage:()=>{
		println("MEMO &lt;NEW message|SHOW [X]|EDIT X message|DELETE X|SWAP X Y|SEARCH X&gt;");
		println("Manager for notetaking. Each option manages the memos in the following way:");
		println("  NEW     Create a new memo, and add it to the end of the memo list");
		println("  SHOW    Show the Xth memo. If X is not present, show all memos");
		println("  EDIT    Replaces de Xth memo with the new message");
		println("  DELETE  Remove the Xth memo from the memo list");
		println("  SWAP    Swaps the position of the Xth and Yth memos");
		println("  SEARCH  Shows all memos that contain the text X");
	},
	memos:[""],
	execute:(params)=>{
		if(params.length==0) print("Missing option. Use \"help memo\" to see a list of available options.","color:#ff0")
		else{
			switch(params[0].toLowerCase()){
				case "new":
					if(params.length>1)
						Memo.memos.push(params.slice(1).join(" "))
					else
						print("Empty memo not stored. Type the content of your memo after \"new\"","color:#ff0")
					break;
				case "show":
					if(parseInt(params[1])!="NaN" && parseInt(params[1])>0)
						println(parseInt(params[1])+". "+Memo.memos[parseInt(params[1])-1])
					else
						if(Memo.memos.length==0)
							println("There are no memos. Use \"memo new\" to create a new memo.","color:#ff0")
						for(let i=1;i<=Memo.memos.length;i++)
							println(i+". "+Memo.memos[i-1])
					break;
				case "edit":
					if(parseInt(params[1])!="NaN" && parseInt(params[1])>0 && parseInt(params[1])<=Memo.memos.length)
						Memo.memos[parseInt(params[1]-1)]=params.slice(1).join(" ")
					else
						print("No such memo found","color:#ff0")
					break;
				case "delete":
					if(parseInt(params[1])!="NaN" && parseInt(params[1])>0 && parseInt(params[1])<=Memo.memos.length)
						Memo.memos.splice(parseInt(params[1]-1),1)
					else
						print("No such memo found","color:#ff0")
					break;
				case "swap":
					if(parseInt(params[1])!="NaN" && parseInt(params[1])>0 && parseInt(params[1])<=Memo.memos.length &&
							parseInt(params[2])!="NaN" && parseInt(params[2])>0 && parseInt(params[2])<=Memo.memos.length){
						let temp=Memo.memos[parseInt(params[2])-1]
						Memo.memos[parseInt(params[2])-1]=Memo.memos[parseInt(params[1])-1]
						Memo.memos[parseInt(params[1])-1]=temp
					} else
						print("No such memo found","color:#ff0")
					break;
				case "search":
					if(params.length>1){
						if(Memo.memos.length==0){
							print("There are no memos. Use \"memo new\" to create a new memo.","color:#ff0")
						} else {
							let found=false;
							for(let i=1;i<=Memo.memos.length;i++){
								if(Memo.memos[i-1].indexOf(params[1])!=-1){
									let memo=Memo.memos[i-1]
									print(i+". ")
									let lastIndex=0;
									while(memo.indexOf(params[1])!=-1){
										let index=memo.indexOf(params[1])
										print(memo.substring(0, index))
										print(memo.substring(index,index+params[1].length),"background:#fff;color:#000")
										memo=memo.substring(index+params[1].length,memo.length)
									}
									println(memo)
									found=true;
								}
							}
							if(!found)
								println("Text not found in any memos.","color:#ff0")
						}
					} else {
						print("No search performed. Type the text you're looking for after \"search\"","color:#ff0")
					}
					break;
				default:
					print("Option \""+params[0]+"\" not found. Use \"help memo\" to see a list of available options.","color:#ff0")
					break;
			}
		}
		println()
	}
}

Mail = {
	name:"mail",
	description:"Email manager. Send or read received emails.",
	helpPage:()=>{
		println("MAIL &lt;LIST|OPEN X|COMPOSE&gt;");
		println("Manager for emails:");
		println("  LIST     Show a list of all emails. A symbol between \"[ \"] shows its state:");
		println("             [ ] Incoming, unopened");
		println("             [X] Incoming, opened");
		println("             [>] Outgoing, sent");
		println("  OPEN     Print the contents of the Xth mail.");
		println("  COMPOSE  Open the mail compose menu. Prompts you for a recipient, a subject, and the content.");
	},
	mails:[
		{"sender":"amroyce@mail.com",
		 "subject":"Service Request",
		 "state":"unread",
		 "content":
			["To Detective Hunter:",
			 "My name is Amelia Royce, and I have heard from a friend of the services you provide.",
			 "From what I've heard, you are very hard to locate, and even harder to convince, but please",
			 "hear my case, for I am desperate.",
			 " - Amelia Royce"]},
	],
	countByState:(state)=>{
		let a=0;
		for(mail of Mail.mails) if(mail.state==state) a++;
		return a;
	},
	execute:(params)=>{
		if(params.length==0) print("Missing option. Use \"help mail\" to see a list of available options.","color:#ff0")
		else{
			switch(params[0].toLowerCase()){
				case "list":
					let indexPadding = Mail.mails.length.toString().length+2;
					let i=1;
					for(mail of Mail.mails){
						print((i+".").padEnd(indexPadding," "))
						switch(mail.state){
							case "unread": print("[ ]"); break;
							case "opened": print("[X]"); break;
							case "sent":   print("[>]"); break;
							default:       print("[?]"); break;
						}
						subPrint=mail.subject;
						if(subPrint.length>20) subPrint=subPrint.substring(0,17)+"...";
						print(" "+subPrint.padEnd(21," "))
						print("| "+mail.sender)
						println()
					}
					break;
				case "open":
					if(parseInt(params[1])!="NaN" && parseInt(params[1])>0){
						let mail = Mail.mails[parseInt(params[1]-1)]
						mail.state="opened";
						println("From   : "+mail.sender)
						println("Subject: "+mail.subject)
						println("".padEnd(Math.max(mail.sender.length,mail.subject.length)+9,"-"));
						for(line of mail.content){
							println(line)
						}
					} else 
						print("No such mail found","color:#ff0")
					break;
				case "compose":
					print("Compose email. prompt for recipient, then subject, then content")
					break;
				default:
					print("Option \""+params[0]+"\" not found. Use \"help mail\" to see a list of available options.","color:#ff0")
					break;
			}
		}
		println()
	}
}

//