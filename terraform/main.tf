resource "aws_instance" "web" {
  ami           = "ami-001e7cc215773c7fb"
  instance_type = "t3.small"
  key_name      = var.key_name

  user_data = <<-EOF
#!/bin/bash
apt update -y
apt install -y docker.io
systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu
EOF

  tags = {
    Name = "Terraform-Web"
  }
}
