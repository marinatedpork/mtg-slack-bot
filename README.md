# MTG Slack Card Fetcher

## A card fetcher that utilizes Slack's Realtime Messaging API

![Imgur](http://i.imgur.com/aMavMjIl.png)

This bot provides a functionality that you might have seen before on sites like Reddit and MTGSalvation. The functionality is straight forward: wrap a card's name in double brackets and the bot will respond with the cards (e.g. [[Black Lotus]]). See the pictures below for an example.

For the application code, this project uses Node.js, MongoDB and the slackbots npm package. For deploying the bot, the project uses Packer to build an AMI with the dependencies and Terraform to start the instance on AWS. The data for the cards from the mtgjson GitHub repo.

# Requirements

* AWS Account, API key, and secret
* MongoDB
* Terraform
* Packer
* Node.js
* A Linux machine of some sort

# Setup

For each of the following setups, you must perform this setup:

1. Setup your integration on Slack.
 1. Goto `https://[YOUR_TEAM].slack.com/apps/manage/custom-integrations`.
 2. Click `Bots`.
 3. Click `Add Configuration`.
 4. Setup your bot.
 5. Get your API Key.
1. Clone the [MTG JSON repository](https://github.com/mtgjson/mtgjson) somewhere else on your computer.
2. Create a `config.js` in the `secrets` directory. Use the Secrets Example below.
1. `npm install` the dependencies for this project.
2. Run the `move-cards` scripts to move all the English file from the MTG JSON `json` directory to the data directory in this repo like so: `PATH_TO_JSON=/path/to/mtgjson/json PATH_TO_DESTINATION=/path/to/data/directory node ./tasks/move-cards.js`

## Local

1. Start MongoDB
2. Add your mongo url to the `mongoUrl` field in the `config/secrets.js`
3. Add the collection name to the `collectionName` field in the `config/secrets.js`
4. Fill in the bot fields in the `config/secrets.js`. The bot ID may be found in the URL when you're editing the bot on Slack's website (something like `https://planeswalker.slack.com/services/BOT_ID_HERE`)
5. Ingest the card data with the following scripts: `PATH_TO_JSON=/path/to/data/directory ./tasks/ingest_cards`
6. Invite the bot to the Slack channel you want it to listen to.
7. Fill in the `adminUser` field in the secrets Run the index script: `node ./index.js`
8. You'll get a PM from the bot saying it is fired up.

## AWS Deployment

This repository also comes with [Terraform](https://www.terraform.io/) and [Packer](https://www.packer.io/) resources for easy AWS cloud deployment. These directions will teach you how to run your very own instance of the bot in the cloud with just a few commands.

In my personal repository, I store secrets and other private information inside of the Terraform and Packer config files, so you'll have to follow the steps and examples below to set up your own configurations.

### Setup

1. Make sure that your `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID` are in your environment.
1. Install Packer and Terraform. If you have `brew`, run `brew install terraform` and `brew install packer`.
1. Create a directory outside of the project for your state file. The path to this directory will be used later on during the deploy.
1. Create a SSH keypair and add it to your SSH agent. For instructions on this, check out [GitHub's helpful walkthrough](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).
1. Create a `deploy/config/keys` directory and move the SSH keypair into it.
1. Inside of the `deploy/config` directory, create a `.tfvars` file. **Make sure this file's name corresponds with the name of the whatevever you name your state file**. State files are created during the terraform apply process.
1. Copy the **Terraform Variables Example** below into the `.tfvars` file and populate each of the variables with the correct values. Use the example values if you're not sure what to put.
2. Create a `.json` file inside of the `deploy/config` directory to store the AMI configuration. Name the file such that it matches the name of your `.tfvars` file except with an `ami-` on front (e.g. `ami-us-east-2-dev.json` if you've name your `.tfvars` file `us-east-2-dev.tfvars`)
3. Copy the **Packer Config Example** below into the `.json` file to, and populate each of the variables with the correct values. Use the example values if you're not sure what to put. **Note**: the `source_ami` will vary by region.

Below is the recommended structure for your `deploy/config` directory:

```
config
  ├── ami-us-east-2-dev.json
  ├── keys
  │   ├── aws_mtg
  │   └── aws_mtg.pub
  └── us-east-2-dev.tfvars

```

### Deploy

Now that you have the configurations in place, deployment is very easy. Run the below commands to build the AMI and apply the terraform resources (except replace the `NAME_OF_VAR_FILE` with the actual name of your `.tfvars` file):

```
cd deploy && MTG_STATE=/path/to/state/file/directory ./utils/pack NAME_OF_VAR_FILE && ./utils/build apply NAME_OF_VAR_FILE
```

For example, if the name of your `.tfvars` is `us-east-2-dev`. Running the below command verbatim will work:

```
cd deploy && MTG_STATE=/path/to/state/file/directory ./utils/pack us-east-2-dev && ./utils/build apply us-east-2-dev
```

When it's done packaging the dist, building the AMI, and applying the terraform resources, you'll get a PM from the bot saying it's fired up and ready to go.

## Secrets Example

```
module.exports = {
  token: 'SLACK API KEY',
  mongoUrl: 'MONGO URL',
  collectionName: 'COLLECTION NAME',
  adminUser: 'YOUR SLACK USERNAME',
  bot: {
    id: 'BOT ID',
    icon: 'BOT EMOJI ICON',
    name: 'BOT NAME'
  }
};
```

## Terraform Variables Example

```
aws_region = "AWS REGION (e.g. us-east-2)"
slackbot_instance_type = "EC2 INSTANCE TYPE (e.g. t2.micro)"
environment = "NAME OF ENVIRONMENT (e.g. dev)"
public_key_path = "RELATIVE PATH TO PUBLIC KEY FOR KEY PAIR (e.g. config/keys/aws_mtg.pub)"
private_key_path = "RELATIVE PATH TO PRIVATE KEY FOR KEY PAIR (e.g. config/keys/aws_mtg)"
key_name = "KEY NAME (e.g. mtg_slackbot)"
white_listed_ip = "YOUR PUBLIC IP"
```

## Packer Config Example

```
{
  "node_version": "7.6.0",
  "region": "REGION TO BUILD AMI (e.g. us-east-2)",
  "source_ami": "AMI TO BUILD OFF OF (e.g. ami-fcc19b99)",
  "instance_type": "INSTANCE SIZE (e.g. t2.micro)",
  "environment": "ENVIRONMENT NAME (e.g. dev)"
}
```