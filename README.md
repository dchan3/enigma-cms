# Enigma CMS

Enigma CMS is an experimental custom CMS project made using the MERN stack.
I codenamed the project "Enigma" because I was feeling cute. To be honest, I might change it later.
I started this project because quite frankly many CMSs out there don't really meet my needs, and I was feeling cute.
I might abandon it later, who knows?

So what features make this thing so outstanding? First off, it's far from outstanding; it's running on a computer.
(Pun totally intended.) Here they are:

-   custom document types editable in the admin panel (and not loaded from some text file like in many CMSs)
-   uses as few dependencies as possible (but hopefully will have a ton of dependents)
-   BUT WAIT! THERE'S MORE! I just couldn't think of anything else off the top of my head.
 
## Getting Started

Clone this repository. If you don't know how by now, being the total n00b you are, here's something for you to blatantly
copy, paste, and execute in your favorite shell:

`git clone https://github.com/dchan3/enigma-cms`

### Prerequisites

This is a **MERN** stack project, so I think it's quite obvious what you need:

-   **M**ongoDB
-   **E**xpress.js
-   **R**eact.js
-   **N**odeJS

You will need to follow the installation instructions catered to your platform.

### Installation

Again, this is a **MERN** stack project. After you clone this repository,
`cd` into the repository and run `npm i`.

### Building

`npm run-script build` or `webpack`

### Firing Up

-   On your local machine in development mode: `npm start`
-   On some server: `node server.bundle.js`

### Deployment

If you deploy this thing on your server,
it must be noted that if you're running it behind a `nginx` reverse proxy,
you had better make sure you can send `POST` requests to it without difficulty.
I'm not gonna lie: I spent a day trying to get my `nginx` configuration correct,
so I'll let you feel my pain and figure it out yourself when you get to this point.

If you do get it figured out, congratulations, it should run as expected. You don't know how proud of you I am.

## Contributing
I don't feel like opening this up to contributors yet. I might change my mind later.

## Dependencies

I did say "as few dependencies as possible." I'll be honest though: there is not much a one-man operation can pump out
on its own. Eventually I'd want this project to be 100% self-sufficient. (No, not the going green type...)

So without further ado, here they are. (Maintainers, you might want to thank me for the clout you receive from these 
mentions of your repositories.)

-   [Handlebars](https://github.com/wycats/handlebars.js) - because hey, I wouldn't say I can make a templating language
all on my own

-   [Styled Components](https://github.com/styled-components/styled-components) - because hard-coding inline CSS is a 
pain

-   [Limax](https://github.com/lovell/limax/issues) - for handling all the slug generation problems thanks in part to
globalization

## Dependents

-   [my personal site which I'm totally not plugging here](https://derekchan.xyz)
-   hopefully many more in the long run

## Authors
-   **Ya Boi** - *pretty much everything* - [dchan3](https://github.com/dchan3)