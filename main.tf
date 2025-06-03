resource "aws_security_group" "react_app_sg" {
    name = "react_app_sg"
    description = "Security group for React app"
    vpc_id = aws_vpc.main.id
    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["156.17.147.57/32"]
    }
    ingress {
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "react_app" {
    ami = "ami-0c1ac8a41498c1a9c" # Ubuntu 22.04 LTS w Twoim regionie
    instance_type = "t2.micro"
    subnet_id = aws_subnet.public.id
    vpc_security_group_ids = [aws_security_group.react_app_sg.id]
    associate_public_ip_address = true
    key_name = "twoja-para-kluczy"
    user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y git nginx curl
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    git clone https://github.com/MateuszDejewski/radio.git
    /home/ubuntu/app
    cd /home/ubuntu/app
    npm install
    npm run build
    rm -rf /var/www/html/*
    cp -r build/* /var/www/html/
    cat > /etc/nginx/sites-available/default <<EOL
    server {
        listen 80 default_server;
        server_name _;
        root /var/www/html;
        index index.html;
        location / {
        try_files \$uri /index.html;
        }
    }
    EOL
    systemctl restart nginx
}