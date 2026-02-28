const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const colors = require('./colors');
const { FORGE_ASCII } = require('./ascii');

class ForgeAgent {
    constructor(persistentState) {
        this.state = persistentState;
        this.workspace = "/mnt/moltos-build/live-build-config";
        this.projectDir = "/home/cube/syncstack/opendev-labs/molt.os";
    }

    async forge(options = {}) {
        console.log(FORGE_ASCII);
        console.log(`${colors.cyan}║ ${colors.white}FORGE AGENT: ${colors.green}INITIATING SOVEREIGN SEQUENCE...${colors.reset}`);

        try {
            // 1. Unblock & Cleanup
            this.cleanup();

            // 2. Secret Validation
            const secretsPath = path.join(this.projectDir, "moltos.secrets");
            if (!fs.existsSync(secretsPath)) {
                throw new Error("moltos.secrets missing! Please provide credentials.");
            }

            // 3. Aesthetic Sync (If requested)
            if (options.themed) {
                this.syncAesthetics();
            }

            // 4. Build Initiation
            await this.executeBuild(options);

            // 5. QEMU Launch
            if (options.test) {
                this.launchTest();
            }

        } catch (error) {
            console.log(`${colors.red}║ ${colors.white}FORGE FAILURE: ${error.message}${colors.reset}`);
        }
    }

    cleanup() {
        console.log(`${colors.cyan}║ ${colors.white}FORGE AGENT: ${colors.zinc}Clearing process locks and mounts...${colors.reset}`);
        try {
            // Kill zombie builds
            execSync('ps aux | grep -E "lb build|debootstrap" | grep -v grep | awk \'{print $2}\' | xargs sudo kill -9 2>/dev/null || true');

            // Unmount stale chroot
            const mounts = [
                `${this.workspace}/chroot/proc`,
                `${this.workspace}/chroot/sys`,
                `${this.workspace}/chroot/dev/pts`,
                `${this.workspace}/chroot/dev`
            ];
            mounts.forEach(m => {
                try { execSync(`sudo umount -l ${m} 2>/dev/null || true`); } catch (e) { }
            });

            console.log(`${colors.cyan}║ ${colors.white}FORGE AGENT: ${colors.green}System unblocked.${colors.reset}`);
        } catch (e) {
            console.log(`${colors.red}║ ${colors.white}Cleanup anomaly: ${e.message}${colors.reset}`);
        }
    }

    syncAesthetics() {
        console.log(`${colors.cyan}║ ${colors.white}FORGE AGENT: ${colors.zinc}Synchronizing Host Aesthetics...${colors.reset}`);

        const localTheme = "/usr/share/themes/Adwaita";
        const localIcons = "/usr/share/icons/Tela-red";
        const chrootThemes = path.join(this.workspace, "kali-config/common/includes.chroot/usr/share/themes");
        const chrootIcons = path.join(this.workspace, "kali-config/common/includes.chroot/usr/share/icons");

        execSync(`sudo mkdir -p ${chrootThemes} ${chrootIcons}`);

        if (fs.existsSync(localTheme)) {
            execSync(`sudo cp -r ${localTheme} ${chrootThemes}/`);
        }
        if (fs.existsSync(localIcons)) {
            execSync(`sudo cp -r ${localIcons} ${chrootIcons}/`);
        }

        // Apply global XFCE settings
        const hookPath = path.join(this.workspace, "kali-config/common/hooks/live/90-inject-theme.chroot");
        const hookContent = `#!/bin/bash
echo "Applying MoltOS Aesthetics (XFCE)..."
mkdir -p /etc/xdg/xfce4/xfconf/xfce-perchannel-xml/
cat <<XFCE > /etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xsettings.xml
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xsettings" version="1.0">
  <property name="Net" type="empty">
    <property name="ThemeName" type="string" value="Adwaita"/>
    <property name="IconThemeName" type="string" value="Tela-red"/>
  </property>
</channel>
XFCE
`;
        fs.writeFileSync("/tmp/90-inject-theme.chroot", hookContent);
        execSync(`sudo mv /tmp/90-inject-theme.chroot ${hookPath} && sudo chmod +x ${hookPath}`);
    }

    async executeBuild(options) {
        console.log(`${colors.cyan}║ ${colors.white}FORGE AGENT: ${colors.green}Starting MoltOS Forge...${colors.reset}`);
        console.log(`${colors.cyan}║ ${colors.white}FORGE AGENT: ${colors.zinc}Volume Label: MOLT OS${colors.reset}`);

        // Prepare workspace
        execSync(`cd ${this.workspace} && sudo lb clean --purge && sudo lb config --iso-volume "MOLT OS"`);

        // Spawn build process
        const build = spawn('sudo', ['lb', 'build'], {
            cwd: this.workspace,
            stdio: 'inherit'
        });

        return new Promise((resolve, reject) => {
            build.on('close', (code) => {
                if (code === 0) {
                    console.log(`${colors.green}║ ${colors.white}FORGE SUCCESSFUL: ISO GENERATED.${colors.reset}`);
                    resolve();
                } else {
                    reject(new Error(`Build failed with code ${code}`));
                }
            });
        });
    }

    launchTest() {
        const iso = execSync(`find ${this.workspace} -name "*.iso" | head -n 1`).toString().trim();
        if (!iso) {
            console.log(`${colors.red}║ ${colors.white}TEST FAILURE: No ISO found.${colors.reset}`);
            return;
        }

        console.log(`${colors.cyan}║ ${colors.white}FORGE AGENT: ${colors.green}Launching QEMU Validator...${colors.reset}`);
        spawn('qemu-system-x86_64', ['-m', '2G', '-enable-kvm', '-cdrom', iso, '-boot', 'd'], {
            stdio: 'ignore',
            detached: true
        }).unref();
    }
}

module.exports = ForgeAgent;
